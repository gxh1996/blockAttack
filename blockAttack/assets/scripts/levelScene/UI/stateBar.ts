import PanelManager from "./panelManager_LS";
import ShowStateDuration from "../prop/showStateDuration";
import EventManager from "../../common/eventManager";
import LoadManager from "../../common/loadManager";
import Widget from "../../common/widget";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateBar extends cc.Component {

    @property({ type: cc.Label })
    private HPLabel: cc.Label = null;
    @property({ type: cc.Label })
    private scoreLabel: cc.Label = null;

    @property({ type: PanelManager })
    private panelManager: PanelManager = null;

    @property({ type: cc.Node })
    private propState: cc.Node = null;

    @property({ type: Widget })
    private setBut: Widget = null;

    /**
     * 道具状态冷却脚本集
     */
    private propStates: Map<string, ShowStateDuration> = new Map();

    onLoad() {
        this.initSubscribe();

    }

    start() {
        this.buildScene();
    }

    private initSubscribe() {
        /* 订阅监听 */
        EventManager.addSubscribe(this, "updatePropDurationShow", function (data: any[]) {
            let propName: string = data[0];
            let duration: number = data[1];
            let ssd: ShowStateDuration = this.propStates.get(propName);
            if (ssd === undefined) {
                cc.error("[ERROR] " + propName + "不在Map里");
                return;
            }
            ssd.setDuration(duration);
        })
    }

    private buildScene() {
        let no: number = LoadManager.loadManager.registerNoOfBuild();

        //初始化propStates
        let children: cc.Node[] = this.propState.children;
        let child: cc.Node = null;
        for (child of children)
            this.propStates.set(child.name, child.getComponent("showStateDuration"));

        this.adaptStateBar();

        //适配BlockRoot的位置
        let ny: number = this.node.getPosition().y;
        let wy: number = this.node.parent.convertToWorldSpaceAR(cc.v2(0, ny - this.node.height)).y;
        EventManager.publishEvent("adaptBlockRoot", cc.view.getVisibleSize().height - wy)

        LoadManager.loadManager.updateRateOfBuild(no, 1);
    }

    updateHPLabel(hp: number) {
        this.HPLabel.string = hp.toString();
    }

    updateScoreLabel(score: number) {
        this.scoreLabel.string = score.toString();
    }

    /* 按钮事件绑定 */
    set() {
        this.panelManager.showSetPanel();
    }

    /**
     * 在微信小游戏中调整stateBar的位置
     */
    private adaptStateBar() {
        if (typeof wx === "undefined") {
            //stateBar的位置
            let wy: number = cc.view.getVisibleSize().height - this.node.height / 2;
            let ny: number = this.node.parent.convertToNodeSpaceAR(cc.v2(0, wy)).y + this.node.height / 2;
            this.node.y = ny;

            EventManager.publishEvent("topWallAdapt", this.node.height);

            //调整set按钮的位置
            this.setBut.top = 8;
            this.setBut.adaptAR();
        }
        else {
            let menu = wx.getMenuButtonBoundingClientRect();
            console.log("menu", menu);

            //stateBar的位置
            let l: number = menu.top * cc.view.getScaleY();
            let wy: number = cc.view.getVisibleSize().height - l - this.node.height / 2;
            let ny: number = this.node.parent.convertToNodeSpaceAR(cc.v2(0, wy)).y + this.node.height / 2;
            this.node.y = ny;

            EventManager.publishEvent("topWallAdapt", l + this.node.height);

            //调整set按钮的位置
            let y: number = menu.bottom * cc.view.getScaleY();
            this.setBut.top = y;
            this.setBut.adaptAR();
        }

    }

}
