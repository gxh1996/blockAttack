const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalScript extends cc.Component {

    /**
     * 是否初始化各模块
     */
    static isInitModuleOfGame: boolean = false;

    static userNick: string = null;

    static imgTexture: cc.Texture2D = null;
}
