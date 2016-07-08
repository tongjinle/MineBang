/**
 * Game
 */
class Game extends egret.EventDispatcher{
    static _game:Game;

    map:Map;

    constructor() {
        super();
        this.map = new Map(Config.width,Config.height,Config.ratio);
    }

    static getIns(){
        this._game = this._game || new Game();
        return this._game;
    }

   on(eventName:string,fn:Function,self:any){
       this.addEventListener(eventName,fn,self);
   }

   off(eventName:string,fn:Function,self:any){
       this.removeEventListener(eventName,fn,self);
   }

   
   fire(eventName:string,data:any){
		this.dispatchEvent(new egret.Event(eventName, false, false, data));
	}

}