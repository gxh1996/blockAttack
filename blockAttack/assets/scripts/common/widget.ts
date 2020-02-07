/*
对齐目标为Canvas
宿主锚点在中心
*/
const { ccclass, property } = cc._decorator;
@ccclass
export default class Widget extends cc.Component {

    top: number = null;

    private winSize: cc.Size;

    onLoad() {
        this.winSize = cc.view.getVisibleSize();

    }

    /**
     * 适配
     */
    adaptAR() {
        if (this.top === null) {
            console.warn("top为null");
            return;
        }
        console.log(this.node.name);
        console.log("top", this.top);
        let wy: number = this.winSize.height - this.top - this.node.height / 2;
        console.log("wy", wy);
        let ny: number = this.node.parent.convertToNodeSpaceAR(cc.v2(0, wy)).y;
        console.log("ny", ny);
        this.node.y = ny;
    }
}
