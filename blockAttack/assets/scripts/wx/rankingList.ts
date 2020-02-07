import WXHelper from "./wxHelper";

const { ccclass, property } = cc._decorator;

//排行榜功能
@ccclass
export default class rankingList extends cc.Component {

    start() {
        if (typeof wx === "undefined")
            return;
        this.hideRankingList();
    }

    /**
     * 显示排行榜
     */
    showRankingList() {
        console.log("开始显示好友排行榜...");

        WXHelper.wxHelper.postMassage("friend", null);
        this.node.setPosition(cc.v2(0, 0));
    }

    /**
     * 隐藏排行榜
     */
    hideRankingList() {
        console.log("隐藏好友排行榜！");
        this.node.setPosition(cc.v2(800, 0));
    }


}
