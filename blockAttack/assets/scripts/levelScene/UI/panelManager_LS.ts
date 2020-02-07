import EventManager from "../../common/eventManager";
import SoundManager from "../../common/soundMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelManager_LS extends cc.Component {

    @property(cc.Node)
    private gameEnd: cc.Node = null;

    @property({ type: cc.Label })
    private scoreInGameEnd: cc.Label = null;

    @property(cc.SpriteFrame)
    private onBGM: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private offBGM: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private onEffect: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private offEffect: cc.SpriteFrame = null;
    @property(cc.Sprite)
    private BGMSet: cc.Sprite = null;
    @property(cc.Sprite)
    private effectSet: cc.Sprite = null;
    private isBGM: boolean = true;
    private isEffect: boolean = true;

    /**
     * 游戏设置面板
     */
    private setPanel: cc.Node = null;

    onLoad() {
        this.setPanel = this.node.getChildByName("set");
    }

    /* 游戏结束面板 */
    showGameEnd(score: number) {
        this.scoreInGameEnd.string = score.toString();
        this.showPanel(this.gameEnd);
    }
    hiddenGameEnd() {
        this.hiddenPanel(this.gameEnd);
    }

    /* 设置面板 */
    showSetPanel() {
        this.showPanel(this.setPanel);
    }
    hiddenSetPanel() {
        this.hiddenPanel(this.setPanel);
    }

    private showPanel(panel: cc.Node) {
        if (panel.active === true)
            return;

        panel.opacity = 0;
        panel.active = true;
        let a: cc.ActionInterval = cc.fadeIn(0.3);
        let func: cc.ActionInstant = cc.callFunc(function () {
            EventManager.publishEvent("gamePause");
        }, this)
        let seq: cc.ActionInterval = cc.sequence(a, func);
        panel.runAction(seq);

    }

    private hiddenPanel(panel: cc.Node) {
        if (panel.active === false)
            return;

        let a: cc.ActionInterval = cc.fadeOut(0.3);
        let func: cc.ActionInstant = cc.callFunc(function () {
            EventManager.publishEvent("gameContinue");
            panel.active = false;
        }, this)
        let seq: cc.ActionInterval = cc.sequence(a, func);
        panel.runAction(seq);
    }

    /* 按钮绑定事件 函数名与节点名一致*/
    resetGame() {
        EventManager.publishEvent("resetGame");
    }

    continueGame() {
        this.hiddenSetPanel();
    }

    exitGame() {
        EventManager.publishEvent("exitGame");
    }

    clickBGMSet() {
        if (this.isBGM) {
            this.isBGM = false;
            SoundManager.soundMgr.offBGM();
            this.BGMSet.spriteFrame = this.offBGM;
        }
        else {
            this.isBGM = true;
            SoundManager.soundMgr.onBGM();
            this.BGMSet.spriteFrame = this.onBGM;
        }
    }

    clickSoundEffectSet() {
        if (this.isEffect) {
            this.isEffect = false;
            SoundManager.soundMgr.offEffect();
            this.effectSet.spriteFrame = this.offEffect;
        }
        else {
            this.isEffect = true;
            SoundManager.soundMgr.onEffect();
            this.effectSet.spriteFrame = this.onEffect;
        }
    }
}
