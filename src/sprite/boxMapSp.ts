/**
 * MapSp ex
 */
class BoxMapSp extends egret.Sprite {
	boxSpList: BoxSp[][];
	constructor(public boxMap: BoxMap) {
		super();

		this.initBg();

		let boxList = this.boxMap.boxList;
		let boxSpList = this.boxSpList = [];
		boxSpList.length = this.boxMap.height;

		for (let y = 0; y < this.boxMap.height; y++) {
			boxSpList[y] = [];
			for (let x = 0; x < this.boxMap.width; x++) {
				let box: Box = boxList[y][x];
				let boxSp: BoxSp = new BoxSp(box);
				boxSpList[y][x] = boxSp;
				this.addChild(boxSp);
			}
		}
		this.width = Config.width;
		this.height = Config.mapHeight;



		this.bind();
	}

	private touchBegin: { x: number, y: number, timeStamp: number };
	private touchEnd: { x: number, y: number, timeStamp: number };
	private longTouchInterval: number = Config.longTouchInterval;
	private timeHandle;
	private onTouch = (e: egret.TouchEvent) => {
		console.log(e.type);
		let x: number = Math.floor(e.stageX / Config.size);
		let y: number = Math.floor(e.stageY / Config.size);
		console.log(x, y);
		let check = (begin: { x: number, y: number, timeStamp: number }, end: { x: number, y: number, timeStamp: number }): void => {
			if (begin && end && begin.x == end.x && begin.y == end.y) {
				let box: Box = this.boxMap.boxList[end.y][end.x];
				if (end.timeStamp - begin.timeStamp < this.longTouchInterval) {
					console.log('touch box');
					box.touch();
				} else {
					console.log('warn box');
					box.warn();
				}
			}
			// 销毁
			this.touchBegin = this.touchEnd = null;
		};
		if (x >= 0 && x < this.boxMap.width && y >= 0 && y < this.boxMap.height) {
			if (e.type == egret.TouchEvent.TOUCH_BEGIN) {
				this.touchBegin = { x, y, timeStamp: new Date().getTime() };

				this.timeHandle = setTimeout(() => {
					this.touchEnd = this.touchEnd || { x: this.touchBegin.x, y: this.touchBegin.y, timeStamp: Infinity };
					check(this.touchBegin, this.touchEnd);
				}, this.longTouchInterval);

			} else if (e.type == egret.TouchEvent.TOUCH_END) {
				this.touchEnd = { x, y, timeStamp: new Date().getTime() };
				check(this.touchBegin, this.touchEnd);
				clearTimeout(this.timeHandle);

			} else if (e.type == egret.TouchEvent.TOUCH_MOVE) {
				console.log('touch move');
				this.touchEnd = { x, y, timeStamp: new Date().getTime() };

			}


			// this.boxMap.boxList[y][x].touch();
		}
	};



	initBg() {
		let bg: egret.Bitmap = new egret.Bitmap(RES.getRes('bg_jpg'));
		// bg.width = Config.width;
		// bg.height = Config.height;
		this.addChild(bg);

	}

	private onNumBoxClean(e) {
		console.log('render.numBox.clean');
		let numBox: NumBox = e.data as NumBox;
		this.boxSpList[numBox.y][numBox.x].refreshTexture();
	}

	private onBoomBoxBoom(e) {
		console.log('render.boomBox.boom');
		let boomBox: BoomBox = e.data as BoomBox;
		this.boxSpList[boomBox.y][boomBox.x].refreshTexture();
        (RES.getRes('crash2_mp3') as egret.Sound).play(0, 1);

	}

	private onBoxWarn(e) {
		let box: Box = e.data as Box;
		this.boxSpList[box.y][box.x].refreshTexture();
	}

	private onBoxWarnWrong(e){
		let wrongBoxList = e.data as Box[];
		wrongBoxList.forEach((box)=>{
			this.boxSpList[box.y][box.x].refreshTexture();
		});
	}

	bind() {
		Game.getIns().on('render.numBox.clean', this.onNumBoxClean, this);
		Game.getIns().on('render.boomBox.boom', this.onBoomBoxBoom, this);
		Game.getIns().on('render.box.warn', this.onBoxWarn, this);
		Game.getIns().on('render.box.warn.wrong',this.onBoxWarnWrong,this);

		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this);

		Game.getIns().on('game.over', () => {
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
		}, this);
	}

	unbind() {

	}
}