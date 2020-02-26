import Block from "../block/block";
import BallManager from "../../../scripts/levelScene/ball/ballManager";
import EventManager from "../../../scripts/common/eventManager";
import Util from "../../../scripts/common/util";
import SoundManager from "../../../scripts/common/soundMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    /* 对象 */
    private board: cc.Node = null;
    private rigid: cc.RigidBody = null;
    private ballManager: BallManager = null;

    /* 控制变量 */
    private needFollowBoard: boolean = false;
    private isGamePause: boolean = false;

    /* 数据变量 */
    /**
     * 在未发球时，与board坐标的偏移值
     */
    private offset: cc.Vec2 = null;
    /**
     * 游戏由暂停时用于存储 ball的线速度
     */
    private vInGamePause: cc.Vec2 = null;

    /**
     * 改变速度方向的阈值。方向离水平方向多少改变
     */
    private thresholdOfChangeDir: number = 10;
    /**
     * 改变的角度
     */
    private degreeOfChange: number = 25;

    /**
     * 屏幕宽度
     */
    private width: number = null;
    /**
     * 
     */
    private fallSpeedOverWindow: number = 300;

    /**
     * Determines whether load on
     */
    onLoad() {
        this.rigid = this.node.getComponent(cc.RigidBody);
        this.ballManager = this.node.parent.getComponent("ballManager");
        this.width = cc.view.getVisibleSize().width;
    }

    init() {
        this.initSubscribe();
        this.initVariable();
    }

    private initVariable() {
        this.needFollowBoard = false;
        this.isGamePause = false;
        this.rigid.linearVelocity = cc.v2(0, 0);
        this.vInGamePause = undefined;
    }

    private initSubscribe() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "gamePause", function () {
            this.vInGamePause = this.rigid.linearVelocity;
            this.rigid.linearVelocity = cc.v2(0, 0);
            this.isGamePause = true;

            // this.rigid.enabled = false;
            // this.enabled = false;
        })
        EventManager.addSubscribe(this, "gameContinue", function () {
            if (this.vInGamePause) {
                this.rigid.linearVelocity = this.vInGamePause;
                this.isGamePause = false;
            }
            // this.rigid.enabled = true;
            // this.enabled = true;
        })
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let node: cc.Node = otherCollider.node;
        let group: string = node.group;
        if (group === "FLOOR")
            return;

        if (group === "BLOCK" && this.needFollowBoard) {
            let block: Block = node.getComponent("block");
            if (!block.deleting) {
                block.deleting = true;
                EventManager.publishEvent("ballToBlock", block);
            }
        }

        SoundManager.soundMgr.playEffect();
    }

    onEndContact(contact, selfCollider, otherCollider) {
        let node: cc.Node = otherCollider.node;
        let group: string = node.group;

        if (group === "BLOCK") {
            let block: Block = node.getComponent("block");
            if (!block.deleting) {
                block.deleting = true;
                EventManager.publishEvent("ballToBlock", block);
            }
        }
        else if (group === "BOARD") {
            this.setSpeed(this.ballManager.getSpeed());
        }

        this.reviseSpeed()
    }

    /**
     * Follows board move
     * @param board 
     * @param offset 与board坐标的偏移值
     */
    followBoardMove(board: cc.Node, offset: cc.Vec2) {
        this.rigid.gravityScale = 0;
        this.board = board;
        this.offset = offset;
        this.needFollowBoard = true;
    }

    /**
     * 取消跟随弹板移动
     */
    cancelFollowBoard() {
        this.rigid.gravityScale = 1;
        this.needFollowBoard = false;
    }

    setLinearVelocity(lv: cc.Vec2) {
        this.rigid.linearVelocity = lv;
    }

    /**
     * 速度的角度
     * @returns degree 
     */
    getDegree(): number {
        return Util.getDegree(this.rigid.linearVelocity);
    }

    /**
     * 改变线速度的方向
     * @param d 
     */
    private changeDegreeOfLV(d: number) {
        let radian: number = d / 180 * Math.PI;
        let xv: number = this.ballManager.getSpeed() * Math.cos(radian);
        let yv: number = this.ballManager.getSpeed() * Math.sin(radian);
        this.rigid.linearVelocity = cc.v2(xv, yv);
    }

    /**
     * 改变速度的大小和方向,degree为空则不改变方向
     * @param speed 
     * @param degree
     */
    setSpeed(speed: number, degree: number = null) {
        if (degree === null)
            degree = Util.getDegree(this.rigid.linearVelocity);

        let radian: number = degree / 180 * Math.PI;
        let xv: number = speed * Math.cos(radian);
        let yv: number = speed * Math.sin(radian);
        this.rigid.linearVelocity = cc.v2(xv, yv);
    }



    /**
     * ball的速度存在ballManager里，speed改变，就要更新速度
     */
    updateSpeed() {
        this.setSpeed(this.ballManager.getSpeed());
    }

    /**修正速度 */
    reviseSpeed() {
        if (this.needFollowBoard)
            return;
        //当球的速度方向趋于水平时，给它一个向下的角度
        let d: number = this.getDegree();
        // console.log(d);
        if (d <= this.thresholdOfChangeDir && d >= 0 || d <= 360 && d >= 360 - this.thresholdOfChangeDir) {
            this.changeDegreeOfLV(360 - this.degreeOfChange);
            // console.log(`${d}°改为${360 - this.degreeOfChange}`);
        }
        else if (d <= 180 - this.thresholdOfChangeDir && d >= 180 || d > 180 && d <= 180 + this.thresholdOfChangeDir) {
            this.changeDegreeOfLV(180 + this.degreeOfChange);
            // console.log(`${d}°改为${180 + this.degreeOfChange}`);
        }

        let newD: number;
        if (d >= 250 && d < 270) {
            newD = 250 - Util.getRandomNumber(0, 10);
            this.changeDegreeOfLV(newD);
            // console.log(`${d}°改为${newD}`);
        }
        else if (d > 270 && d <= 290) {
            newD = 290 + Util.getRandomNumber(0, 10);
            this.changeDegreeOfLV(newD);
            // console.log(`${d}°改为${newD}`);
        }
        else if (d === 270) {
            newD = 270 + Util.getRandomNumber(0, 1);
            if (newD === 0)
                newD = 270 + Util.getRandomNumber(15, 30);
            else
                newD = 270 - Util.getRandomNumber(15, 30);
            this.changeDegreeOfLV(newD);
            // console.log(`${d}°改为${newD}`);

        }
    }

    update(dt) {
        if (this.isGamePause)
            return;

        //跟随弹板移动
        if (this.needFollowBoard) {
            let wP: cc.Vec2 = this.board.parent.convertToWorldSpaceAR(this.board.getPosition());
            wP = wP.add(this.offset);
            let nP: cc.Vec2 = this.node.parent.convertToNodeSpaceAR(wP);
            this.node.setPosition(nP);
        }
        else { //已发射
            //弹板将把球挤到边界里
            let nP: cc.Vec2 = this.node.getPosition();
            let wP: cc.Vec2 = this.node.parent.convertToWorldSpaceAR(nP);
            if (wP.x <= 0 || wP.x >= this.width) {
                this.rigid.linearVelocity = cc.v2(0, -this.fallSpeedOverWindow);
            }
            //已把球挤出可视范围
            if (wP.x + this.node.width / 2 <= 0 || wP.x - this.node.width / 2 >= this.width) {
                EventManager.publishEvent("deleteBall", this);
            }
        }
    }

}
