

export default class Util {

    /**
     * 将摄像头坐标转为世界坐标
     * @param cP 
     * @returns camera to world pos 
     */
    public static convertCameraToWorldPos(cP: cc.Vec2): cc.Vec2 {
        let camera: cc.Camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        let wP: cc.Vec2;
        wP = camera.getCameraToWorldPoint(cP, wP);
        return wP;
    }


    /**
     * 移除数组元素
     * @param array 
     * @param item 
     * @returns false: 没有该元素 
     */
    public static removeArrayItem(array: any[], item: any): boolean {
        let i: number = array.indexOf(item);
        if (i < 0)
            return false;

        array.splice(i, 1);
        return true;
    }

    /**
     * Gets degree
     * @param dir 方向向量
     * @returns degree [0,360)
     */
    public static getDegree(dir: cc.Vec2): number {
        let rot: number;
        if (dir.x === 0 && dir.y === 0)
            return null;
        if (dir.x === 0 && dir.y > 0) //y上半轴
            return 90;
        else if (dir.x === 0 && dir.y < 0) //y下半轴
            return 270;
        else { //不在y轴上
            let r: number = Math.atan(dir.y / dir.x);
            let d: number = r * 180 / Math.PI;
            rot = d;
        }

        if (rot === 0) //在x轴上
            if (dir.x > 0)
                rot = 0;
            else
                rot = 180;
        else if (dir.x < 0 && dir.y > 0 || dir.x < 0 && dir.y < 0) //在第二三象限
            rot += 180;
        else if (dir.x > 0 && dir.y < 0) //在第四象限
            rot += 360;
        return rot;
    }

    /**
     * Gets random Integer, [min, max]
     * @param min 
     * @param max 
     */
    static getRandomNumber(min: number, max: number): number {
        let r: number = min + Math.floor(Math.random() * (max - min + 1));
        return r;
    }

}