const { ccclass, property } = cc._decorator;

@ccclass
export default class OpenPhysicsEngine extends cc.Component {

    @property({})
    private isDebug: boolean = false;

    @property({})
    private gravity: cc.Vec2 = new cc.Vec2(0, 0);

    onLoad() {
        //开启物理引擎
        cc.director.getPhysicsManager().enabled = true;
        if (this.isDebug) {
            //开启调试信息
            let Bits: cc.DrawBits = cc.PhysicsManager.DrawBits;//这是我们要显示的类型信息
            cc.director.getPhysicsManager().debugDrawFlags = Bits.e_jointBit | Bits.e_shapeBit | Bits.e_centerOfMassBit;
        }
        else {
            //关闭调试
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }
        cc.director.getPhysicsManager().gravity = this.gravity;
    }
}
