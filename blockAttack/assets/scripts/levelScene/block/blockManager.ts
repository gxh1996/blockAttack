import Util from "../../common/util";
import PropManager from "../prop/propManager";
import EventManager from "../../common/eventManager";
import Block from "../../../res/prefabs/block/block";
import LoadManager from "../../common/loadManager";
import Widget from "../../common/widget";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockManager extends cc.Component {

    @property([cc.SpriteFrame])
    private blockImages: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    private blockPrefab: cc.Prefab = null;

    @property(PropManager)
    private propManager: PropManager = null;

    /* block矩阵属性 */
    /**
     * block间的水平距离
     */
    private readonly intervalOfH: number = 4;
    /**
     * block间的垂直距离
     */
    private readonly intervalOfV: number = 4;
    /**
     * block矩阵初始行数
     */
    private readonly initRow: number = 4;
    /**
     * block矩阵初始列数
     */
    private readonly initColumn: number = 11;
    private readonly blockHeight: number = 20;

    /**
     * block的active === true 的节点
     */
    private blockArray: Block[] = [];
    private blockPool: cc.NodePool = new cc.NodePool();

    onLoad() {
        EventManager.addSubscribe(this, "adaptBlockRoot", (l: number) => {
            let widget: Widget = this.node.getComponent("widget");
            widget.top = l;
            widget.adaptAR();

            this.buildBlockRoot();
        })
    }

    /**
     * 生成block矩阵
     */
    private buildBlockRoot() {
        let no: number = LoadManager.loadManager.registerNoOfBuild();

        let y: number = 0;
        let x: number;
        for (let i = 0; i < this.initRow; i++) { //一行
            this.createRowBlock(y);
            y -= this.blockHeight + this.intervalOfV;
        }

        LoadManager.loadManager.updateRateOfBuild(no, 1);
    }
    private createRowBlock(y: number) {
        let x: number = 0;
        let c: number = (this.initColumn - 1) / 2;

        //中间块
        let n: cc.Node = this.addBlock();
        n.setPosition(x, y);

        for (let j = 0; j < c; j++) {
            x += n.width + this.intervalOfH;

            n = this.addBlock();
            n.setPosition(x, y);

            n = this.addBlock();
            n.setPosition(-x, y);

        }
    }

    /**
     * 将一个随机砖块加入BlockRoot下
     */
    private addBlock(): cc.Node {
        let n: cc.Node = this.getBlockFromPool();
        this.node.addChild(n);
        let b: Block = n.getComponent("block");
        this.blockArray.push(b);
        b.init(this.blockImages[Util.getRandomNumber(0, 2)]);
        return n;
    }
    private getBlockFromPool(): cc.Node {
        if (this.blockPool.size() > 0) {
            let n: cc.Node = this.blockPool.get();
            n.opacity = 255;
            return n;
        }
        else
            return cc.instantiate(this.blockPrefab);
    }
    private putBlockIntoPool(n: cc.Node) {
        this.blockPool.put(n);
    }

    /**
     * 将所有block向下移动一个身位,并生成一行block
     */
    moveDownAllBlock() {
        for (let i = 0; i < this.blockArray.length; i++) {
            this.blockArray[i].node.y -= this.blockHeight + this.intervalOfH;
        }

        this.createRowBlock(0);
    }

    /**
     * 初始化 所有block
     */
    initBlockRoot() {
        //回收所有block
        while (this.blockArray.length > 0) {
            this.putBlockIntoPool(this.blockArray.pop().node);
        }

        this.buildBlockRoot();
    }

    /**
     * 删除砖块，掉落一个随机道具
     * @param b 
     * @returns  
     */
    deleteBlock(b: Block) {
        if (!b) {
            console.error("砖块异常！b:", b);
            return;
        }

        let wP: cc.Vec2 = b.node.parent.convertToWorldSpaceAR(b.node.getPosition());
        Util.removeArrayItem(this.blockArray, b);
        this.putBlockIntoPool(b.node);

        //随机道具
        this.propManager.createPropInRandom(wP);
    }

    // update (dt) {}
}
