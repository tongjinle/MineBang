/**
 * Box
 */
abstract class Box {
    constructor(public x:number,public y:number,public type:BoxType,public isWarn = false) {
        
    }

    onWarn(){
        this.isWarn = !this.isWarn;
    }

    touch(){
        Game.getIns().fire('box.touch',{box:this});
    }
}