const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    private sprite: cc.Sprite = null;
    deleting: boolean = false;

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
    }

    init(s: cc.SpriteFrame) {
        this.sprite.spriteFrame = s;
        this.deleting = false;
    }
}
