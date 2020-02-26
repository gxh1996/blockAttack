import EventManager from "../../common/eventManager";
import Util from "../../common/util";
import Prop from "./prop";
import JsonData from "../../common/jsonData";
import LoadManager, { LoadedTask } from "../../common/loadManager";

const { ccclass, property } = cc._decorator;

/**
 * 道具效果计时类
 */
class EffectTimer {

    /**
     * 道具效果数组
     */
    private static effectList: EffectTimer[] = [];
    /**
     * 记录道具效果生效的个数
     */
    // private static effectNum = {
    //     "addLengthOfBoard": 0,
    //     "subLengthOfBoard": 0,
    //     "addSpeedOfBall": 0,
    //     "subSpeedOfBall": 0,
    //     "addSpeedOfBoard": 0,
    // }
    private static exclusiveProp: object;

    /**
     * 添加道具效果计时器，若该道具效果已生效就更新其计时器为0
     * @param name 道具名
     * @param total 持续时间
     * @param isOver 效果是否能叠加
     * @param data 数据
     */
    static addEffectTimer(name: string, total: number, isOver: boolean, data: any = null) {
        let e: EffectTimer;
        if (isOver) {
            e = new EffectTimer(name, total, data);
            this.effectList.push(e);
            EventManager.publishEvent("prop:" + name, data);
            // this.effectNum[name]++;

            // EventManager.publishEvent("updatePropDurationShow", [name, 1]);
        }
        else { //不能叠加就重置效果时间
            if (this.effectList.length > 0) {
                for (e of this.effectList)
                    if (e.name === name) {//该道具效果已生效，更新它的持续时间
                        e.updateTotalT();
                        return;
                    }
            }
            e = new EffectTimer(name, total, data);
            this.effectList.push(e);
            EventManager.publishEvent("prop:" + name, data);
            // this.effectNum[name]++;
        }

        //删除互斥的道具
        let ep: string = this.exclusiveProp[name];
        this.clearEffect(ep);

    }

    /**
     * 对所有计时器进行计时，到时间的计时器自动发出事件并销毁
     */
    static timing(dt: number) {
        if (this.effectList.length === 0)
            return;

        //倒着计时，在更新技能冷却时，让可叠加效果的道具中以持续时间最小为显示
        let i = this.effectList.length - 1;
        while (i >= 0) {
            if (this.effectList[i].timing(dt))
                Util.removeArrayItem(this.effectList, this.effectList[i]);
            i--;
        }
    }

    static setExclusiveProp(ep: object) {
        this.exclusiveProp = ep;
    }

    /**
     * 清空所有效果记录
     */
    static clearAllEffect() {
        this.effectList = [];
    }

    /**
     * 删除所有该道具效果
     * @param effect 
     */
    private static clearEffect(effect: string) {
        for (let i: number = 0; i < this.effectList.length; i++)
            if (this.effectList[i].name === effect) {
                this.deleteEffect(i);
                i--;
            }

    }

    private static deleteEffect(i: number) {
        let eT: EffectTimer = this.effectList[i];
        eT.endEffect();
        //从当前生效列表中删除
        this.effectList.splice(i, 1);
        //更新状态栏道具生效的显示
        EventManager.publishEvent("updatePropDurationShow", [eT.name, 0]);
    }

    /**
     * 道具名
     */
    private name: string;
    /**
     * 效果持续时间
     */
    private totalT: number;
    /**
     * 计时器
     */
    private cT: number;
    private data: any;
    private count: number;
    /**
     * Creates an instance of effect timer.
     * @param name 道具名
     * @param total 持续时间
     * @param data 数据
     */
    private constructor(name: string, total: number, data: any = null) {
        this.name = name;
        this.totalT = total;
        this.data = data;
        this.cT = 0;
        this.count = 1;
    }

    /**增加计时器个数 */
    private addNum() {
        this.count++;
    }

    /**
     * 计时，道具失效就返回true;
     * @param dt 
     * @returns true if timing 
     */
    private timing(dt: number): boolean {
        let ret: boolean = false;
        this.cT += dt;
        if (this.cT >= this.totalT) { //道具效果失效
            this.endEffect();
            // EffectTimer.effectNum[this.name]--;
            ret = true;
        }

        //更新技能冷却的显示
        EventManager.publishEvent("updatePropDurationShow", [this.name, (this.totalT - this.cT) / this.totalT]);

        return ret;
    }

    /**
     * 结束道具的效果
     */
    private endEffect() {
        if (this.data === null)
            EventManager.publishEvent("effectEnd:" + this.name);
        else
            EventManager.publishEvent("effectEnd:" + this.name, this.data);
    }

    /**
     * 更新计时器为0
     * @param t 
     */
    private updateTotalT() {
        this.cT = 0;
    }
}

@ccclass
export default class PropManager extends cc.Component {

    /**
     * 道具预制体集
     */
    private propPrefabs = {};
    /**
     * 道具生成概率
     */
    private readonly propRate;
    /**
     * prop的下落速度
     */
    private readonly fallSpeed: cc.Vec2 = cc.v2(0, -130);

    private readonly effectDataOfProp: JsonData;
    private propArray: Prop[] = null;

    private isGamePause: boolean = false;

    onLoad() {
        this.propArray = [];
        this.loadRes();
        this.initSubscribe();
    }

    private loadRes() {
        let task: LoadedTask = LoadManager.loadManager.getTask();

        // 加载道具预制体
        task.loadResDir("propPrefabs", cc.Prefab, function (res: any[]) {
            for (let i = 0; i < res.length; i++) {
                this.propPrefabs[res[i].name] = res[i];
            }
        }.bind(this))

        task.loadRes("json/effectDataOfProp", cc.JsonAsset, function (res) {
            this.effectDataOfProp = new JsonData(res);
        }.bind(this))

        task.loadRes("json/exclusiveProp", cc.JsonAsset, function (res) {
            EffectTimer.setExclusiveProp(res.json);
        }.bind(this))

        task.loadRes("json/createRateOfProp", cc.JsonAsset, function (res) {
            this.propRate = res.json;
        }.bind(this))
    }

    private initSubscribe() {
        EventManager.addSubscribe(this, "deleteProp", (prop: Prop) => {
            this.deleteProp(prop);
        })

        EventManager.addSubscribe(this, "triggerProp", (propName: string) => {
            this.triggerEffect(propName)
        })

        EventManager.addSubscribe(this, "gamePause", () => {
            this.isGamePause = true;
            this.pauseAllProp();
        })

        EventManager.addSubscribe(this, "gameContinue", () => {
            this.isGamePause = false;
            this.continueAllProp();
        })

    }

    /**
     * 触发效果
     * @param effect 效果/道具名 
     * @param isOver 效果能否叠加
     */
    private triggerEffect(effect: string) {
        //道具效果有两种：即时生效和持续生效。持续生效道具有两种：可叠加和不可叠加
        let o: object = this.effectDataOfProp.get("propName", effect);
        switch (effect) {
            case "addBall": { //增加球/血
                EventManager.publishEvent("prop:addBall");
                break;
            }
            case "addCountOfBall": {
                EventManager.publishEvent("prop:addCountOfBall", o["degree"]); //参数为分裂球的偏角
                break;
            }
            case "addLengthOfBoard": {
                EffectTimer.addEffectTimer(effect, o["duration"], o["isOver"], o["addLength"]);//4为持续时间，120为增加的长度
                break;
            }
            case "addSpeedOfBall": {
                EffectTimer.addEffectTimer(effect, o["duration"], o["isOver"], o["addSpeed"]);
                break;
            }
            case "addSpeedOfBoard": {
                EffectTimer.addEffectTimer(effect, o["duration"], o["isOver"], o["addSpeed"]);
                break;
            }
            case "subLengthOfBoard": {
                EffectTimer.addEffectTimer(effect, o["duration"], o["isOver"], o["subLength"]);
                break;
            }
            case "subSpeedOfBall": {
                EffectTimer.addEffectTimer(effect, o["duration"], o["isOver"], o["subSpeed"]);
                break;
            }
        }
    }

    /**
     * 50%概率随机生成道具
     * @param wP 世界坐标
     * @returns  
     */
    createPropInRandom(wP: cc.Vec2) {
        let r: number = Util.getRandomNumber(1, 100);
        let sum: number;
        // console.log(r);
        if ((r -= this.propRate.addBall) <= 0)
            this.createProp("addBall", wP);
        else if ((r -= this.propRate.addCountOfBall) <= 0)
            this.createProp("addCountOfBall", wP);
        else if ((r -= this.propRate.addLengthOfBoard) <= 0)
            this.createProp("addLengthOfBoard", wP);
        else if ((r -= this.propRate.addSpeedOfBall) <= 0)
            this.createProp("addSpeedOfBall", wP);
        else if ((r -= this.propRate.addSpeedOfBoard) <= 0)
            this.createProp("addSpeedOfBoard", wP);
        else if ((r -= this.propRate.subLengthOfBoard) <= 0)
            this.createProp("subLengthOfBoard", wP);
        else if ((r -= this.propRate.subSpeedOfBall) <= 0)
            this.createProp("subSpeedOfBall", wP);
    }

    /**
     * 生成道具
     * @param prop 道具名 
     * @param wP 世界坐标
     */
    private createProp(prop: string, wP: cc.Vec2) {
        if (this.propPrefabs[prop] === undefined)
            cc.error("[ERROR] 没有道具" + prop + "的预制体!");

        let node: cc.Node = cc.instantiate(this.propPrefabs[prop]);
        this.node.addChild(node);
        let scr: Prop = node.getComponent("prop");
        this.propArray.push(scr);
        let nP: cc.Vec2 = this.node.convertToNodeSpaceAR(wP);
        scr.init(nP, prop, this.fallSpeed);
        // console.log(prop);
    }

    private deleteProp(p: Prop) {
        Util.removeArrayItem(this.propArray, p);
        p.node.removeFromParent();
        p.node.destroy();
    }

    clearAllProp() {
        this.node.removeAllChildren();
        this.propArray = [];
        EffectTimer.clearAllEffect();
    }

    private pauseAllProp() {
        let p: Prop;
        for (p of this.propArray) {
            p.setSpeed(cc.v2(0, 0))
        }
    }
    private continueAllProp() {
        let p: Prop;
        for (p of this.propArray) {
            p.setSpeed(this.fallSpeed)
        }
    }

    update(dt) {
        if (this.isGamePause)
            return;
        EffectTimer.timing(dt);
    }
}
