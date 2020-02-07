export default class SoundManager {
    static soundMgr: SoundManager = null;

    /**
     * 使用前必须初始化
     */
    static init(BGMUrl: string, effectUrl: string) {
        SoundManager.soundMgr = new SoundManager(BGMUrl, effectUrl);
    }

    private BGMSwitch: boolean = null;
    private effectSwitch: boolean = null;
    private bgm: cc.AudioClip;
    private effect: cc.AudioClip;

    constructor(BGMUrl: string, effectUrl: string) {
        this.BGMSwitch = true;
        this.effectSwitch = true;

        cc.loader.loadRes(BGMUrl, cc.AudioClip, function (e, clip) {
            this.bgm = clip;
            this.onBGM();
        }.bind(this))
        cc.loader.loadRes(effectUrl, cc.AudioClip, function (e, clip) {
            this.effect = clip;
        }.bind(this))
    }

    /**
     * 打开背景音乐
     */
    onBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    /**
     * 关闭背景音乐
     */
    offBGM() {
        cc.audioEngine.stopMusic();
    }

    /**
     * 打开音效
     */
    onEffect() {
        this.effectSwitch = true;
    }

    /**
     * 关闭音效
     */
    offEffect() {
        this.effectSwitch = false;
    }

    /**
     * 播放一次音效
     */
    playEffect() {
        if (!this.effectSwitch)
            return;

        cc.audioEngine.playEffect(this.effect, false);
    }
}