import EventManager from "../../common/eventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Board_M extends cc.Component {

    /**
     * board移动速度
     */
    moveSpeed: number = 700;

    start() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "prop:addSpeedOfBoard", function (as: number) {
            this.moveSpeed += as;
        })
        EventManager.addSubscribe(this, "effectEnd:addSpeedOfBoard", function (as: number) {
            this.moveSpeed -= as;
        })
    }



    // update (dt) {}
}
