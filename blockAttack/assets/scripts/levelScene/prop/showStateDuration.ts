const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowStateDuration extends cc.Component {

    private bar: cc.Sprite = null;

    onLoad() {
        this.bar = this.node.getChildByName("bar").getComponent(cc.Sprite);
    }

    /**
     * 设置该状态还能持续时间的百分比
     * @param n [0,1]
     */
    setDuration(n: number) {
        this.bar.fillRange = 1 - n;
    }

}
