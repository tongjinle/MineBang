/**
 * BoxSp
 */
class BoxSp extends egret.Sprite {
    bitMap:egret.Bitmap;

    constructor(public box:Box) {
        super();
        this.x = this.box.x * Config.size;
        this.y = this.box.y * Config.size;
        
        let bitMap:egret.Bitmap = this.bitMap = new egret.Bitmap(this.getTexture(this.box));
        this.addChild(bitMap);
        
    }

    private getTexture(box:Box):egret.Texture{
        let texture:egret.Texture;
        let resName:string;

        if(this.box.isWarn){
            resName = 'flag_png';
        }else if(this.box.type == BoxType.num){
            let numBox:NumBox = this.box as NumBox;
            if(numBox.isClean){
                resName = numBox.num+'_png';
            }else{
                resName = 'none_png';
            }
        }else if(this.box.type == BoxType.boom){
            let boomBox:BoomBox = this.box as BoomBox;
            if(boomBox.isBoom){
                resName = 'bomb_png';
            }else{
                resName = 'none_png';
            }
        }

       return RES.getRes(resName);
        
    }

    refreshTexture():void{
        this.bitMap.texture = this.getTexture(this.box);
    }

}