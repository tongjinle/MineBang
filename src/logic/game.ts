/**
 * Game
 */
class Game extends egret.EventDispatcher{
    static _game:Game;

    boxMap:BoxMap;

    constructor() {
        super();
    }

    static getIns(){
        Game._game = Game._game || new Game();
        return Game._game;
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

    // 
    startGame(){
        this.boxMap = new BoxMap(Config.width,Config.height,Config.ratio);
        this.boxMap.firstTip();
    }

    bind(){
        Game.getIns().on('game.pass',()=>{
            (RES.getRes('win_mp3') as egret.Sound).play(0,1);
            Game.getIns().fire('game.over',null);
        },this);
    }
   

}