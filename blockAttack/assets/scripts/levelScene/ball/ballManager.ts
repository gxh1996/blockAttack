import Util from "../../common/util";
import EventManager from "../../common/eventManager";
import Board_C from "../board/board_C";
import Ball from "../../../res/prefabs/balls/ball";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallManager extends cc.Component {

    @property({ type: cc.Prefab })
    private ballPrefab: cc.Prefab = null;

    @property({ type: Board_C })
    private board: Board_C = null;

    private ballArray: Ball[] = [];
    /**
     * 球的速度
     */
    private speed: number = 500;

    private ballPool: cc.NodePool;

    onLoad() {
        this.ballPool = new cc.NodePool();
        this.initSubscribe();
        this.initVariable();
    }

    initVariable() {
        this.speed = 500;
    }

    initSubscribe() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "deleteBall", (ball: Ball) => {
            this.destroyBall(ball);
        })

        EventManager.addSubscribe(this, "prop:addCountOfBall", function (d: number) {
            if (this.ballArray.length === 0 || !this.board.isShooted())
                return;

            this.addAllCountOfBall(d);
        });

        EventManager.addSubscribe(this, "prop:addSpeedOfBall", function (as: number) {
            this.speed += as;
            this.updateSpeedOfAllBall();
        })
        EventManager.addSubscribe(this, "effectEnd:addSpeedOfBall", function (ss: number) {
            this.speed -= ss;
            this.updateSpeedOfAllBall();
        })

        EventManager.addSubscribe(this, "prop:subSpeedOfBall", function (ss: number) {
            this.speed -= ss;
            this.updateSpeedOfAllBall();
        })
        EventManager.addSubscribe(this, "effectEnd:subSpeedOfBall", function (as: number) {
            this.speed += as;
            this.updateSpeedOfAllBall();
        })

    }

    createBall(): Ball {
        let ball: cc.Node = this.getBallFromPool();
        let scr: Ball = ball.getComponent("ball");
        this.node.addChild(ball);
        scr.init();
        this.ballArray.push(scr);
        return scr;
    }
    private getBallFromPool(): cc.Node {
        if (this.ballPool.size() > 0) {
            let n: cc.Node = this.ballPool.get();
            n.opacity = 255;
            return n;
        }
        else {
            return cc.instantiate(this.ballPrefab);
        }
    }

    /**
     * 给球一个初始线速度，发球时用
     * @param speed 
     */
    setInitedLVOfBall(ball: Ball) {
        ball.setLinearVelocity(cc.v2(0, this.speed));
    }

    getSpeed(): number {
        return this.speed;
    }

    /**
     * 道具效果：增加所有球的数量
     * @param d 分裂球的偏角
     */
    private addAllCountOfBall(d: number) {
        let l: number = this.ballArray.length;
        for (let i: number = 0; i < l; i++) {
            let ball: Ball = this.ballArray[i];
            let b1: Ball = this.createBall();
            let b2: Ball = this.createBall();
            //设置坐标
            let p: cc.Vec2 = ball.node.getPosition();
            b1.node.setPosition(p);
            b2.node.setPosition(p);
            //设置速度
            let ballDegree: number = ball.getDegree();
            b1.setSpeed(this.speed, ball.getDegree() + d);
            b2.setSpeed(this.speed, ball.getDegree() - d);
        }
    }

    destroyBall(ball: Ball) {
        EventManager.deleteSubscribes(ball);
        Util.removeArrayItem(this.ballArray, ball);
        this.putBallToPool(ball.node);

        if (this.ballArray.length === 0)
            EventManager.publishEvent("ballCountZero");
    }
    private putBallToPool(n: cc.Node) {
        this.ballPool.put(n);
    }

    clearAllBall() {
        while (this.ballArray.length > 0) {
            let ball: Ball = this.ballArray.pop();
            EventManager.deleteSubscribes(ball);
            this.putBallToPool(ball.node);
        }
    }

    /**
     * 更新所有球的速度
     */
    private updateSpeedOfAllBall() {
        let ball: Ball;
        for (ball of this.ballArray)
            ball.updateSpeed();
    }
}
