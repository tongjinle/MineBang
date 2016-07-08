/**
 * Map
 */
class Map {
    boxList: Box[][];
    constructor(public width: number, public height: number, public ratio: number = .2) {
        this.boxList = [];
        this.seedBoom();
        this.mark();
    }


    private seedBoom() {
        var count = Math.floor(this.width * this.height * this.ratio);
        var dict = {};
        while (count--) {
            var flag = true;
            while (flag) {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
                if (dict[`${x}-${y}`] === undefined) {
                    dict[`${x}-${y}`] = { x: x, y: y };
                    flag = false;
                }
            }
        }

        for (let i = 0; i < this.height; i++) {
            this.boxList.push([]);
        }
        for (let i in dict) {
            var posi = dict[i];
            this.boxList[posi.y][posi.x] = new BoomBox(posi.x, posi.y);
        }
    }

    private mark() {
        var markOne = (boxList: Box[][], x, y) => {
            if(this.boxList[y][x].type == BoxType.boom){
                return;
            }

            var arr = [
                { x: x - 1, y: y - 1 },
                { x: x, y: y - 1 },
                { x: x + 1, y: y - 1 },
                { x: x - 1, y: y },
                { x: x, y: y },
                { x: x + 1, y: y },
                { x: x - 1, y: y + 1 },
                { x: x, y: y + 1 },
                { x: x + 1, y: y + 1 }
            ];
            let count:number = 0;
            for(let posi of arr){
                if(posi.x>=0 && posi.x<this.width && posi.y>=0 && posi.y<this.height){
                    let box:Box = boxList[posi.y][posi.x];
                    if(box.type == BoxType.boom){
                        count++;
                    }
                }
            }
            let box = this.boxList[y][x] as NumBox;
            box.num = count;
        };
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                markOne(this.boxList, x, y);
            }
        }
    }

    private check() { }

    private onBoxTouch(e) {
        var data = e.data;
        console.log(data);
    }
    private bind() {
        Game.getIns().on('box.touch', this.onBoxTouch, this);
    }

    private unbind() {
        Game.getIns().off('box.touch', this.onBoxTouch, this);
    }
}