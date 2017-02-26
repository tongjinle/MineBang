/**
 * Map
 */


class BoxMap {
	boxList: Box[][];
	constructor(public width: number, public height: number, public ratio: number = .2) {
		this.boxList = [];
		this.seedBoom();
		this.mark();

		this.bind();
	}

	boomCount:number;
	cleanCount:number = 0 ;
	private seedBoom() {
		var count = this.boomCount = Math.floor(this.width * this.height * this.ratio);
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
			let arr = [];
			arr.length = this.width;
			this.boxList.push(arr);
		}
		for (let i in dict) {
			var posi = dict[i];
			this.boxList[posi.y][posi.x] = new BoomBox(posi.x, posi.y);
		}
	}

	private mark() {
		var markOne = (boxList: Box[][], x, y) => {
			if (this.boxList[y][x]) {
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
			let count: number = 0;
			for (let posi of arr) {
				if (posi.x >= 0 && posi.x < this.width && posi.y >= 0 && posi.y < this.height) {
					let box: Box = boxList[posi.y][posi.x];
					if (box && box.type == BoxType.boom) {
						count++;
					}
				}
			}
			let box = this.boxList[y][x] = new NumBox(x, y);
			box.num = count;
		};
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				markOne(this.boxList, x, y);
			}
		}
	}

	private _check;
	private check() {
		let _check = this._check = _.debounce(()=>{
			for(let y=0;y<this.height;y++){
				for(let x=0;x<this.width;x++){
					let box = this.boxList[y][x];
					if(box.type==BoxType.num && !(box as NumBox).isClean){
						return;
					}
				}
			}
			Game.getIns().fire('game.pass',null);
		},100);
		_check();
	}


	firstTip() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let box = this.boxList[y][x];
				if (box.type == BoxType.num) {
					let numBox = box as NumBox;
					if (numBox.num == 0) {
						numBox.touch();
						return;
					}
				}
			}
		}
	}

	getNear(x:number,y:number,type:string):Box[]{
		let boxList : Box[]=[];
		let arr:{x:number,y:number}[];
		if(type == 'circle'){
			arr = [
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
		}else if(type == 'line'){
			arr = [
				{ x: x, y: y - 1 },
				{ x: x, y: y + 1 },
				{ x: x - 1, y: y },
				{ x: x + 1, y: y }
			];
		}

		arr.forEach(posi=>{
			if (posi.x >= 0 && posi.x < this.width && posi.y >= 0 && posi.y < this.height) {
				boxList.push(this.boxList[posi.y][posi.x]);
			}
		});

		return boxList;
	}



	private onBoxTouch(e) {
		var data = e.data;
		console.log(data);
	}
	private onNumBoxClean(e) {
		// var boxSp:BoxSp = this.box
		console.log('numBox.clean');
		let numBox: NumBox = e.data as NumBox;
		Game.getIns().fire('render.numBox.clean', numBox);
		this.cleanCount ++;
		Game.getIns().fire('render.numBox.refreshCleanCount', this.cleanCount);
		
		this.check();
	}

	private onNumBoxExpand(e) {
		let numBox: NumBox = e.data as NumBox;

		let near = this.getNear(numBox.x, numBox.y, 'line');
		near.forEach((box) => {
			if (box.type == BoxType.num) {
				let nearBox: NumBox = box as NumBox;
				if (!nearBox.isClean && (numBox.num == 0 || nearBox.num == 0)) {
					box.touch();
				}
			}
		});
	}

	private onNumBoxBatch(e) {
		let numBox = e.data as NumBox;
		let near = this.getNear(numBox.x,numBox.y,'circle');
	
		let count: number = 0;
		let rightCount:number = 0;
		let wrongBoxList:Box[] = [];
		let unWarnBoxList:Box[]=[];
		near.forEach((box)=>{
			if(box.isWarn){
				count++;
				if(box.type == BoxType.boom){
					rightCount++;
				}else{
					wrongBoxList.push(box);
				}
			}else if(box.type == BoxType.boom){
				unWarnBoxList.push(box);
			}
		});

		if(numBox.num == count){
			if(count == rightCount){
				near.forEach((box)=>{
					if(box && box.type == BoxType.num && !box.isWarn && !(box as NumBox).isClean){
						box.touch();
					}
				});
			}else{
				wrongBoxList.forEach((box) => { box.isWarnWrong = true; });
				Game.getIns().fire('render.box.warn.wrong',wrongBoxList);
				Game.getIns().fire('boomBox.boom',unWarnBoxList[0]);
				// Game.getIns().fire('game.over',null);
			}
		}

	}

	private onBoomBoxBoom(e){
		let boomBox = e.data as BoomBox;
		Game.getIns().fire('render.boomBox.boom',boomBox);
		Game.getIns().fire('game.over',null);
		
	}

	private onBoxWarn(e){
		let box = e.data as Box;
		Game.getIns().fire('render.box.warn',box);
	}

	private bind() {
		Game.getIns().on('box.touch', this.onBoxTouch, this);
		Game.getIns().on('numBox.clean', this.onNumBoxClean, this);
		Game.getIns().on('numBox.expand', this.onNumBoxExpand, this);
		Game.getIns().on('numBox.batch', this.onNumBoxBatch, this);
		Game.getIns().on('boomBox.boom',this.onBoomBoxBoom,this);
		Game.getIns().on('box.warn',this.onBoxWarn,this);
		
	}

	private unbind() {
		Game.getIns().off('box.touch', this.onBoxTouch, this);
	}
}