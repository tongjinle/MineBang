/**
 * NumBox
 */
class NumBox extends Box {
    num:number = 0;
    isClean:boolean = false;
    constructor(x:number,y:number) {
        super(x,y,BoxType.num);
    }

}