/**
 * NumBox
 */
class NumBox extends Box {
    num:number = 0;

    
    private _isClean : boolean;
    public get isClean() : boolean {
        return this._isClean;
    }
    public set isClean(v : boolean) {
        this._isClean = v;
        if(this._isClean){
            Game.getIns().fire('numBox.clean',this);
        }
    }
    

    constructor(x:number,y:number) {
        super(x,y,BoxType.num);
    }

}