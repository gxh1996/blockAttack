import EventManager from "../common/eventManager";
import LoadManager from "../common/loadManager";
import LoadProgress from "../../res/prefabs/loadProgress/loadProgress";
import Util from "../common/util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IndexScene extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "没有登录前的全屏mask"
    })
    private mask: cc.Node = null;

    @property({
        type: LoadProgress
    })
    private loadProgress: LoadProgress = null;

    onLoad() {
        this.initSubscribe();
        for (let i = 0; i < 100; i++) {
            console.log(Util.getRandomNumber(0, 1));
        }
    }

    private initSubscribe() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "loadItem", () => { this.loadProgress.setProgress(LoadManager.loadManager.getLoadedRate()) });

        EventManager.addSubscribe(this, "loginSuccess", (() => {
            this.mask.active = false;
        }).bind(this))
    }

    /* 按钮事件绑定 */
    startGame() {
        this.loadProgress.show();
        LoadManager.loadManager.setLoadState(true, true, true);
        LoadManager.loadManager.loadScene("levelScene");
    }

    onDestroy() {
        EventManager.clearSubscribe();
    }
}
