/**
 * BoomBox
 */
class BoomBox extends Box {
    private _isBoom : boolean;
    public get isBoom() : boolean {
        return this._isBoom;
    }
    public set isBoom(v : boolean) {
        this._isBoom = v;
        if(this._isBoom){
            Game.getIns().fire('boomBox.boom',this);
        }
    }
    

    constructor(x:number,y:number) {
        super(x,y,BoxType.boom);
    }
}