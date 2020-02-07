import EventManager from "../../common/eventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Board_V extends cc.Component {

    /**
     * 合法移动的x坐标范围，节点坐标
     */
    private legalMoveRange: number = null;
    private rigid: cc.RigidBody = null;

    private moveData = {
        isMove: false,
        destinationX: 0,
        direction: null, //true右
    }

    private isGamePause: boolean = false;

    onLoad() {
        this.rigid = this.node.getComponent(cc.RigidBody);

        //计算弹板合法移动x坐标的范围,如果用移动超过范围后修正会产生抖动，所以不修复并留出超出的距离。
        this.updateMoveRange();

    }

    start() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "gamePause", function () {
            this.rigid.linearVelocity = cc.v2(0, 0);
            this.isGamePause = true;
            // this.enabled = false;
        })

        EventManager.addSubscribe(this, "gameContinue", function () {
            this.isGamePause = false;
            // this.enabled = true;
        })
    }

    /**
     * 更新弹板合法移动范围
     */
    updateMoveRange() {
        let windowSize: cc.Size = cc.view.getVisibleSize();
        this.legalMoveRange = windowSize.width / 2 - this.node.width / 2 - 3;
    }

    /**
     * Moves to
     * @param desX 世界坐标X 
     * @returns  
     */
    moveTo(desX: number, speed: number) {
        let nodeP: cc.Vec2 = this.node.parent.convertToNodeSpaceAR(cc.v2(desX, 0));
        nodeP = this.valueInMoveRange(nodeP);

        let cx: number = this.node.getPosition().x;

        //位移太小不移动
        if (Math.abs(cx - nodeP.x) < 5)
            return;

        if (cx < nodeP.x) {
            this.rigid.linearVelocity = cc.v2(speed, 0);
            this.moveData.direction = true;
        }
        else if (cx > nodeP.x) {
            this.rigid.linearVelocity = cc.v2(-speed, 0);
            this.moveData.direction = false;
        }
        else
            return;

        this.moveData.isMove = true;
        this.moveData.destinationX = nodeP.x;
    }

    /**
     * des是否在合法范围里移动
     * @param des 节点坐标
     * @returns 返回合法范围的坐标
     */
    valueInMoveRange(des: cc.Vec2): cc.Vec2 {
        let ret: cc.Vec2;
        if (des.x <= this.legalMoveRange && des.x >= -this.legalMoveRange)
            ret = des;
        else if (des.x > this.legalMoveRange)
            ret = cc.v2(this.legalMoveRange, des.y);
        else
            ret = cc.v2(-this.legalMoveRange, des.y);
        return ret;
    }

    update(dt) {
        if (this.isGamePause)
            return;

        if (this.moveData.isMove) {
            if ((this.moveData.direction && this.node.x >= this.moveData.destinationX) || (!this.moveData.direction && this.node.x <= this.moveData.destinationX)) {
                this.rigid.linearVelocity = cc.v2(0, 0);
                this.moveData.isMove = false;
            }

        }
    }
}
