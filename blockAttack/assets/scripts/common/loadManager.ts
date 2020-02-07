import EventManager from "./eventManager";

/**
 * 加载任务
 */
export class LoadedTask {
    /**
     * 记录每个任务的加载率
     */
    private rateOfLoadList: number[];

    /**
     * 当前加载任务数
     */
    private totalCountOfLoad: number;

    /**
     * 完成任务数
     */
    private completedCount: number;

    private completeCallback: Function;

    /**
     * LoadManager.taskArray[index]
     */
    private index: number;

    /**
     * @param [completeCallback] 所有加载任务完成后的回调函数 
     */
    constructor(i: number, completeCallback: Function = null) {
        this.rateOfLoadList = [];
        this.totalCountOfLoad = 0;
        this.completedCount = 0;
        this.index = i;
        this.completeCallback = completeCallback;
    }

    /**
     * 加载单个资源
     * @param url 路径
     * @param type 资源类型 
     * @param completeCallback 回调函数 
     */
    loadRes(url: string, type: any, completeCallback: (r) => void = null) {
        let self = this;

        //加载任务下标
        let no: number = this.rateOfLoadList.length;
        this.rateOfLoadList.push(0);
        this.totalCountOfLoad++;

        cc.loader.loadRes(url, type, (e, r: any) => {
            if (e) {
                console.error(e);
                return;
            }
            if (completeCallback !== null)
                completeCallback(r);
            self.rateOfLoadList[no] = 1;
            self.completedCount++;

            self.checkComplete()
        });
    }

    /**
     * 加载文件夹下的所有资源
     * @param url 文件夹路径
     * @param type 资源类型
     * @param completeCallback 回调函数 
     */
    loadResDir(url: string, type: any, completeCallback: (r: any[]) => void = null) {
        let self = this;
        let no: number = this.rateOfLoadList.length;
        this.rateOfLoadList.push(0);
        this.totalCountOfLoad++;

        cc.loader.loadResDir(url, type, (completedCount: number, totalCount: number, item) => {
            if (totalCount === 0)
                self.rateOfLoadList[no] = 0;
            else
                self.rateOfLoadList[no] = completedCount / totalCount;
            self.checkComplete()
        }, (e, r: any[]) => {
            if (e) {
                console.error(e);
                return;
            }

            if (completeCallback !== null)
                completeCallback(r);
            self.rateOfLoadList[no] = 1;
            self.completedCount++;
        })
    }

    /**
     * 获得当前所有资源的总加载率
     * @returns 1表示所有资源加载完或，-1表示没有加载任务。
     */
    getLoadedRate(): number {
        if (this.totalCountOfLoad === this.completedCount) {
            if (this.totalCountOfLoad === 0)
                return -1;
            else
                return 1;
        }

        let sum: number = 0;
        for (let i = 0; i < this.rateOfLoadList.length; i++)
            sum += this.rateOfLoadList[i];
        let r: number = sum / this.totalCountOfLoad;
        return r;
    }

    /**
     * 如果有所有任务加载完成后的回调函数并所有加载完成则调用
     */
    private checkComplete() {
        EventManager.publishEvent("loadItem");
        if (this.completeCallback !== null && this.completedCount === this.totalCountOfLoad)
            this.completeCallback();
        LoadManager.loadManager._checkComplete();
    }

}

/**
 * 加载管理模块，场景加载、资源加载、场景搭建。实现三者加载总进度统计
 * 使用该模块时必须init()
 * 默认是什么也不加载，所以每次加载一系列东西前必须设置setLoadState()。加载完后会自动初始化
 * 每次加载一项会发出事件loadItem。加载完成会发出事件loadComplete。
 */
export default class LoadManager {

    static loadManager: LoadManager = null;

    /**
     * 必须初始化后才能使用
     */
    static init() {
        if (this.loadManager === null) {
            this.loadManager = new LoadManager();
            this.loadManager.initRecord();
        }
        else
            console.warn("重复实例化！");
    }

    //加载任务记录
    private isLoadRes: boolean;
    private taskArray: LoadedTask[];

    //加载场景记录
    private isLoadScene: boolean;
    private rateOfLoadScene: number;

    //场景搭建
    private isBuild: boolean;
    private rateOfBuild: number[];

    /**
     * 加载完成回调函数
     */
    private func: Function;

    /**
     * 设置所有加载完成的回调函数
     */
    setCompleteCallback(func: Function) {
        this.func = func;
    }

    /**
     * 每次开始加载时多要设置一下这次要加载哪些东西
     */
    setLoadState(needLoadRes: boolean, needLoadScene: boolean, needBuild: boolean) {
        this.isLoadRes = needLoadRes;
        this.isLoadScene = needLoadScene;
        this.isBuild = needBuild;
    }

    /**
     * 得到一个加载任务
     * @param completeCallback 任务完成的回调函数
     */
    getTask(completeCallback: Function = null): LoadedTask {
        let t: LoadedTask = new LoadedTask(this.taskArray.length, completeCallback);
        this.taskArray.push(t);
        return t;
    }

    /**
     * Loads scene
     * @param name 场景名 
     * @param [completeCallback] 跳转场景后执行
     */
    loadScene(name: string, completeCallback: Function = null) {
        let self = this;

        cc.director.preloadScene(name, (completedCount, totalCount, item) => {
            if (totalCount === 0)
                self.rateOfLoadScene = 0;
            else
                self.rateOfLoadScene = completedCount / totalCount;
            self._checkComplete();
        }, (e, a) => {
            cc.director.loadScene(name, completeCallback);
            self._checkComplete();
        });
    }

    /**
     * 申请一个场景搭建编号，用来记录搭建是否完成
     */
    registerNoOfBuild(): number {
        let no = this.rateOfBuild.length;
        this.rateOfBuild.push(0);
        return no;
    }

    /**
     * 更新搭建进度
     * @param no 搭建编号
     * @param rate 进度
     */
    updateRateOfBuild(no: number, rate: number) {
        this.rateOfBuild[no] = rate;
        this._checkComplete();
    }

    /**
     * 获得所有加载任务、加载场景的、场景搭建的总加载率
     * 没有加载内容是为进度为100.
     */
    getLoadedRate(): number {
        if (!this.isLoadScene && !this.isLoadRes && !this.isBuild)
            return 100;

        let loadScene: number = 1;
        let loadRes: number = 1;
        let build: number = 1;
        let r: number;

        //场景加载率
        if (this.isLoadScene)
            loadScene = this.rateOfLoadScene;

        //资源加载率
        if (this.isLoadRes) {
            loadRes = 0;
            if (this.taskArray.length !== 0) {
                for (let i = 0; i < this.taskArray.length; i++)
                    loadRes += this.taskArray[i].getLoadedRate();
                loadRes /= this.taskArray.length;
            }
        }

        //场景搭建率
        if (this.isBuild) {
            build = 0;
            if (this.rateOfBuild.length !== 0) {
                for (let i = 0; i < this.rateOfBuild.length; i++)
                    build += this.rateOfBuild[i];
                build /= this.rateOfBuild.length;
            }
        }

        r = Math.round((loadScene * 0.3 + loadRes * 0.4 + build * 0.3) * 100);
        // console.log(r);
        return r;
    }

    /**
     * 初始化所有的加载记录
     */
    initRecord() {
        this.taskArray = [];
        this.isLoadRes = false;

        this.rateOfLoadScene = 0;
        this.isLoadScene = false;

        this.rateOfBuild = [];
        this.isBuild = false;

        this.func = null;
    }

    /**
     * 所有加载任务、加载场景的、场景搭建完成。调用加载完成回调函数
     */
    _checkComplete() {
        let r = this.getLoadedRate();
        if (r === 100) {
            if (this.func !== null)
                this.func();
            EventManager.publishEvent("loadComplete");
            this.initRecord();
        }
        EventManager.publishEvent("loadItem");
    }

}
