import StateBar from "../UI/stateBar";
import EventManager from "../../common/eventManager";
import BlockManager from "../block/blockManager";
import PanelManager from "../UI/panelManager_LS";
import Board_C from "../board/board_C";
import BallManager from "../ball/ballManager";
import PropManager from "../prop/propManager";
import LoadManager, { LoadedTask } from "../../common/loadManager";
import LoadProgress from "../../../res/prefabs/loadProgress/loadProgress";
import WXHelper from "../../wx/wxHelper";
import Block from "../../../res/prefabs/block/block";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {

    /* 对象 */
    private stateBar: StateBar = null;

    @property({ type: PanelManager })
    private panelManager: PanelManager = null;

    @property({ type: LoadProgress })
    private loadProgress: LoadProgress = null;

    @property(BlockManager)
    private blockManager: BlockManager = null;

    private board: Board_C = null;
    private ballManager: BallManager = null;
    private propManager: PropManager = null;

    /* 数据 */
    private hp: number = 3;
    private score: number = 0;
    /**
     * blockRoot多久下移一次
     */
    private readonly blocksDownT: number = 8;

    /* 控制 */
    private isGamePause: boolean = false;
    private cT: number = 0;

    onLoad() {
        this.loadProgress.node.active = true;
        this.loadRes();
        this.initVariable();
        this.initSubscribe();
        this.loadProgress.show();
        this.loadProgress.setProgress(LoadManager.loadManager.getLoadedRate());
    }

    start() {
        this.buildScene();
    }

    _start() {
        this.updatteStateBar();
    }

    /**
     * 加载资源
     */
    private loadRes() {
    }

    /**
     * 初始化引用
     */
    private initVariable() {
        this.stateBar = cc.find("Canvas/UIRoot/stateBar").getComponent("stateBar");
        this.panelManager = cc.find("Canvas/UIRoot/panels").getComponent("panelManager_LS");
        this.board = cc.find("Canvas/gameContext/board").getComponent("board_C");
        this.ballManager = cc.find("Canvas/gameContext/ballRoot").getComponent("ballManager");
        this.propManager = cc.find("Canvas/gameContext/propRoot").getComponent("propManager");
    }

    /**
     * 初始化订阅
     */
    private initSubscribe() {
        /* 事件订阅 */
        EventManager.addSubscribe(this, "gameEnd", () => {
            this.gameEnd();
        })

        EventManager.addSubscribe(this, "gamePause", () => {
            this.isGamePause = true;
        })

        EventManager.addSubscribe(this, "gameContinue", () => {
            this.isGamePause = false;
        })

        EventManager.addSubscribe(this, "loadComplete", () => {
            let self = this;
            this._start();
            this.loadProgress.setProgress(100);
            this.scheduleOnce(() => {
                self.loadProgress.hide();
            }, 0.6);

        })

        EventManager.addSubscribe(this, "loadItem", () => { this.loadProgress.setProgress(LoadManager.loadManager.getLoadedRate()) });

        EventManager.addSubscribe(this, "ballCountZero", function () {
            this.subHP();
            if (this.hp > 0)
                EventManager.publishEvent("createInitBall");
            else
                this.gameEnd();
        })

        EventManager.addSubscribe(this, "ballToBlock", function (block: Block) {
            this.addScore(10);
            this.blockManager.deleteBlock(block);
        })

        EventManager.addSubscribe(this, "resetGame", function () {
            this.resetGame();
        })

        EventManager.addSubscribe(this, "exitGame", function () {
            this.exitGame();
        })

        EventManager.addSubscribe(this, "prop:addBall", this.addHP);
    }

    /**
     * 搭建场景
     */
    private buildScene() {
    }

    private subHP() {
        this.hp--;
        this.stateBar.updateHPLabel(this.hp);
    }

    private addHP() {
        this.hp++;
        this.stateBar.updateHPLabel(this.hp);
    }

    private addScore(score: number) {
        this.score += score;
        this.stateBar.updateScoreLabel(this.score);
    }

    /**
     * 更新状态栏显示
     */
    private updatteStateBar() {
        this.stateBar.updateHPLabel(this.hp);
        this.stateBar.updateScoreLabel(this.score);
    }

    private resetGame() {
        //初始化状态栏
        this.hp = 3;
        this.score = 0;
        this.updatteStateBar();
        this.stateBar.clearPropDurationShow();

        //初始化控制
        this.isGamePause = false;
        this.cT = 0;

        //删除所有ball
        this.ballManager.clearAllBall();
        this.ballManager.initVariable();

        //初始化blockRoot
        this.blockManager.initBlockRoot();

        //初始化board
        this.board.initBoard();

        //删除所有的道具
        this.propManager.clearAllProp();

        //隐藏重置按钮所在的面板
        this.panelManager.hiddenGameEnd();
        this.panelManager.hiddenSetPanel();
    }

    private exitGame() {
        LoadManager.loadManager.loadScene("indexScene", () => {
            if (typeof wx !== "undefined") {
                EventManager.publishEvent("showUserInfo");
                WXHelper.wxHelper.postMassage("friend", null);
            }
        });
    }

    private gameEnd() {
        this.panelManager.showGameEnd(this.score);

        //上传分数
        if (typeof wx !== "undefined") {
            WXHelper.wxHelper.uploadScore(this.score);
        }
    }

    update(dt) {
        if (this.isGamePause)
            return;

        this.cT += dt;
        if (this.cT >= this.blocksDownT) {
            this.cT = 0;
            this.blockManager.moveDownAllBlock();
        }
    }

    onDestroy() {
        EventManager.clearSubscribe();
    }
}
