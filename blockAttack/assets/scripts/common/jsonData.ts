/**
 * 方便读取Json文件
 */
export default class JsonData {

    private json: object[] = null;

    /**
     * Creates an instance of json data.
     * @param json 
     */
    constructor(json: cc.JsonAsset) {
        if (json === null) {
            cc.error("[ERROR] json为null!");
            return;
        }

        this.json = json.json;
    }

    /**
     * 得到某对象
     * @param idName 
     * @param idValue 
     * @returns get 
     */
    get(idName: string, idValue: string): object {
        let o: object = this.getObject(idName, idValue);
        if (o === null) {
            cc.error("[ERROR] 没有对象的字段" + idName + "的值是" + idValue);
            return null;
        }
        return o;
    }

    /**
     * 由字段名和值在json的对象数组中找到想要的对象
     * @param idName 
     * @param idValue 
     * @returns object 
     */
    private getObject(idName: string, idValue: string): object {
        let o: object = null;
        let t: object;
        for (t of this.json)
            if (t[idName] === idValue) {
                o = t;
                break;
            }
        return o;
    }
}