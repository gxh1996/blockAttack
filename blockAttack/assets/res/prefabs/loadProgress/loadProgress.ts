const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadProgress extends cc.Component {

    @property({ type: cc.ProgressBar })
    private progress: cc.ProgressBar = null;

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }

    /**
     * 设置显示进度
     * @param p 百分比
     */
    setProgress(p: number) {
        this.progress.progress = p / 100;
    }

}
