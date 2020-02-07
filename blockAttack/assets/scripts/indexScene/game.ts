import GlobalScript from "../common/globalScript";
import EventManager from "../common/eventManager";
import WXLogin from "../wx/wxLogin";
import WXHelper from "../wx/wxHelper";
import LoadManager from "../common/loadManager";
import SoundManager from "../common/soundMgr";

const { ccclass, property } = cc._decorator;

//游戏启动脚本
@ccclass
export default class Game extends cc.Component {

    onLoad() {
        if (!GlobalScript.isInitModuleOfGame) {
            console.log("开始初始化游戏系统模块...");

            //系统模块
            EventManager.init();
            LoadManager.init();
            SoundManager.init("sounds/bgm", "sounds/collision");

            //微信模块
            WXLogin.init();
            WXHelper.init();

            //登录微信
            WXLogin.wxLogin.updateManager();

            GlobalScript.isInitModuleOfGame = true;
            console.log("游戏系统模块初始化成功！");

        }
    }

}
