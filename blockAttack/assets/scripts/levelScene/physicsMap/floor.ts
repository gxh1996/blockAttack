import Prop from "../prop/prop";
import Ball from "../../../res/prefabs/balls/ball";
import EventManager from "../../common/eventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Floor extends cc.Component {

    start() {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let node: cc.Node = otherCollider.node;
        let group: string = node.group;
        if (group === "BALL") { //碰撞到球
            let ball: Ball = node.getComponent("ball");
            ball.destrySelf();
        }
        else if (group === "PROP") {
            let prop: Prop = node.getComponent("prop");
            prop.destroySelf();
        }
        else if (group === "BLOCK")
            EventManager.publishEvent("gameEnd");
    }
}
