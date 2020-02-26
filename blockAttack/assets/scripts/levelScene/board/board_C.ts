import Board_V from "./board_V";
import Board_M from "./board_M";
import Util from "../../common/util";
import BallManager from "../ball/ballManager";
import EventManager from "../../common/eventManager";
import Prop from "../prop/prop";
import Ball from "../../../res/prefabs/balls/ball";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Board_C extends cc.Component {

    /* 对象 */
    private board_V: Board_V = null;
    private board_M: Board_M = null;
    private ballManager: BallManager = null;
    /**
     * 待发射的球
     */
    private idleBall: Ball = null;
    /**
     * 弹板碰撞器
     */
    private collider: cc.PhysicsBoxCollider = null;
    private canvas: cc.Node = null;

    /* 数据变量 */
    /**
     * board的初始坐标 Canvas节点坐标
     */
    private initPos: cc.Vec2 = null;
    /**记录由于道具效果影响下积累的宽度，但实际显示的board宽不会超过屏幕大小 */
    private boardWidth: number = 0;
    private initWidth: number = 120;
    private excuteList: [Function, number] = null;

    /* 控制变量 */
    private needShoot: boolean = true;

    onLoad() {
        this.board_V = this.node.getComponent("board_V");
        this.board_M = this.node.getComponent("board_M");
        this.ballManager = cc.find("Canvas/gameContext/ballRoot").getComponent("ballManager");
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.canvas = cc.find("Canvas");

        //计算board的y坐标
        let windowSize: cc.Size = cc.view.getVisibleSize();
        this.initPos = cc.v2(0, -windowSize.height / 2 + 180);

    }

    start() {
        //初始化board
        this.initBoard();

        /* 触摸监听 */
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (this.needShoot) {
                this.needShoot = false;
                this.shootBall();
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.move, this);

        this.canvas.on(cc.Node.EventType.TOUCH_START, this.move, this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, this.move, this);

        /* 事件订阅 */
        EventManager.addSubscribe(this, "createInitBall", function () {
            //隔段时间调用
            this.scheduleOnce(this.createInitBall, 1.5);
        })

        EventManager.addSubscribe(this, "prop:addLengthOfBoard", function (len: number) {
            //在这里立即执行会报错，很烦！不知道为什么，以后考虑不要立即执行
            // this.changeWidth(len)
            this.excuteList = [this.changeWidth, len];
        })
        EventManager.addSubscribe(this, "effectEnd:addLengthOfBoard", function (len: number) {
            this.changeWidth(-len);
        })

        EventManager.addSubscribe(this, "prop:subLengthOfBoard", function (len: number) {
            this.changeWidth(- len);
        })
        EventManager.addSubscribe(this, "effectEnd:subLengthOfBoard", function (len: number) {
            this.changeWidth(len);
            //弹板变大可能会超出屏幕，所以要修正一下
            // let x: number = this.board_V.valueInMoveRange(cc.v2(this.node.x, 0)).x;
            // this.node.x = x;
        })

        // this.scheduleOnce(() => {
        //     this.node.x = 200;
        // }, 3)

    }

    initBoard() {
        this.boardWidth = this.node.width;
        this.node.width = this.initWidth;
        this.collider.size.width = this.initWidth;
        this.collider.apply();
        this.node.setPosition(this.initPos);
        this.createInitBall();
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let node: cc.Node = otherCollider.node;
        let group: string = node.group;

        if (group === "PROP") {
            let prop: Prop = node.getComponent("prop");
            prop.trigger();
        }
        else if (group == "BLOCK")
            EventManager.publishEvent("gameEnd");
    }

    /**
     * 是否发球了
     * @returns true if shooted 
     */
    isShooted(): boolean {
        return !this.needShoot; //需要发球true   没有发球： false
    }

    /**
     * 在弹板上方生成一个静止的初始球
     */
    private createInitBall(): Ball {
        let ball: Ball = this.ballManager.createBall();
        this.idleBall = ball;

        let offset: cc.Vec2 = cc.v2(0, this.node.height / 2 + ball.node.height / 2 + 10);
        let wP: cc.Vec2 = this.node.convertToWorldSpaceAR(offset);
        let nP: cc.Vec2 = ball.node.parent.convertToNodeSpaceAR(wP);
        ball.node.setPosition(nP);
        ball.followBoardMove(this.node, offset);
        this.needShoot = true;
        return ball;
    }

    /**
     * 发射球，将球节点移动到ballRoot上
     */
    private shootBall() {
        this.idleBall.cancelFollowBoard();
        this.ballManager.setInitedLVOfBall(this.idleBall);
        this.idleBall = null;
    }

    /**
     * 改变弹板的宽度为w，并自动更新其移动的范围
     * @param changeL  长度改变量
     */
    private changeWidth(changeL: number) {
        let windowSize: cc.Size = cc.view.getVisibleSize();

        this.boardWidth = this.node.width + changeL;
        if (this.boardWidth >= windowSize.width - 2) {
            this.node.width = windowSize.width - 2;
        }
        else
            this.node.width = this.boardWidth;
        this.board_V.updateMoveRange();
        this.collider.size.width = this.node.width;
        this.collider.apply();
        //弹板变大可能会超出屏幕，所以要修正一下
        let x: number = this.board_V.valueInMoveRange(cc.v2(this.node.x, 0)).x;
        this.node.x = x;
    }

    /**
     * 移动回调函数
     */
    private move(e) {
        let touP: cc.Vec2 = e.getLocation();
        let wP: cc.Vec2 = Util.convertCameraToWorldPos(touP);
        this.board_V.moveTo(wP.x, this.board_M.moveSpeed);
    }

    update(dt) {
        if (this.excuteList) {
            this.excuteList[0].call(this, this.excuteList[1]);
            this.excuteList = null;
        }
    }
}
