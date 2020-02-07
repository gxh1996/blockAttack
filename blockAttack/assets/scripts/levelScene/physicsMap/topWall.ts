import EventManager from "../../common/eventManager";
import Widget from "../../common/widget";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TopMap extends cc.Component {

    private widget: Widget = null;

    onLoad() {
        this.widget = this.node.getComponent("widget");

        EventManager.addSubscribe(this, "topWallAdapt", (l: number) => {
            this.widget.top = l;
            this.widget.adaptAR();
        })
    }

}
