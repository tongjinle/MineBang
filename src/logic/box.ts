/**
 * Box
 */
abstract class Box {
    constructor(public x: number, public y: number, public type: BoxType, public isWarn = false) {
        this.touchDict = {};
        this.touchDict[BoxType.num] = (box) => {
            var numBox: NumBox = box as NumBox;
            if (!numBox.isClean) {
                numBox.isClean = true;
            }
            // 扩散
            Game.getIns().fire('numBox.expand', numBox);

        };

        this.touchDict[BoxType.boom] = (box) => {
            var boomBox: BoomBox = box as BoomBox;
            if (!boomBox.isBoom) {
                boomBox.isBoom = true;
                (RES.getRes('crash2_mp3') as egret.Sound).play(0,1);
            }
        };
    }

    onWarn() {
        this.isWarn = !this.isWarn;
    }

    private touchDict: { [boxType: number]: (box: Box) => void };
    touch() {
        this.touchDict[this.type](this);
        Game.getIns().fire('box.touch', { box: this });
    }

    warn() {
        this.isWarn = !this.isWarn;
    }

}