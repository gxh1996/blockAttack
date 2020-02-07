import EventManager from "../common/eventManager";
import GlobalScript from "../common/globalScript";
import LoadManager from "../common/loadManager";
import LoadProgress from "../../res/prefabs/loadProgress/loadProgress";
import SoundManager from "../common/soundMgr";

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
