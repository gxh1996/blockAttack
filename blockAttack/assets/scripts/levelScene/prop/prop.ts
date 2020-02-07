import EventManager from "../../common/eventManager";
import PropManager from "./propManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Prop extends cc.Component {

    private rigid: cc.RigidBody = null;
    private propName: string = null;

    onLoad() {
        this.rigid = this.node.getComponent(cc.RigidBody);
    }

    /**
     * Inits prop
     * @param pos 节点坐标
     * @param propName 道具名
     * @param speed 下落速度
     */
    init(pos: cc.Vec2, propName: string, speed: cc.Vec2) {
        this.node.setPosition(pos);
        this.rigid.linearVelocity = speed;
        this.propName = propName;

    }

    setSpeed(v: cc.Vec2) {
        this.rigid.linearVelocity = v;
    }

    /**
     * 触发道具效果并删除自己
     */
    trigger() {
        EventManager.publishEvent("triggerProp", this.propName);
        this.destroySelf();
    }

    destroySelf() {
        EventManager.publishEvent("deleteProp", this);
    }
}
