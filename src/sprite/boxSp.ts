/**
 * BoxSp
 */
class BoxSp extends egret.Sprite {
    constructor(public box:Box) {
        super();
        this.x = this.box.x * Config.size;
        this.y = this.box.y * Config.size;
    }
}