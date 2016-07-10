/**
 * MapSp ex
 */
class BoxMapSp extends egret.Sprite {
	boxSpList:BoxSp[][];
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
				let boxSp:BoxSp = new BoxSp(box);
				boxSpList[y][x] = boxSp;
				this.addChild(boxSp);
			}
		}
		this.width =600;
		this.height=512;
		


		this.bind();
	}


	private onTouch = (e:egret.TouchEvent)=>{
		console.log(e);
		let x:number = Math.floor(e.stageX/Config.size);
		let y:number = Math.floor(e.stageY/Config.size);
		console.log(x,y);
		if(x>=0 && x<this.boxMap.width && y>=0 && y<this.boxMap.height){
			this.boxMap.boxList[y][x].touch();
		}
	};
	


	initBg(){
		let bg:egret.Bitmap = new egret.Bitmap(RES.getRes('bg_jpg'));
		// bg.width = Config.width;
		// bg.height = Config.height;
		this.addChild(bg);
		
	}

	private onNumBoxClean(e){
		console.log('render.numBox.clean');
		let numBox:NumBox = e.data as NumBox;
		this.boxSpList[numBox.y][numBox.x].refreshTexture();
	}

	private onBoomBoxBoom(e){
		console.log('render.boomBox.boom');
		let boomBox:BoomBox = e.data as BoomBox;
		this.boxSpList[boomBox.y][boomBox.x].refreshTexture();
	}

	bind(){
		Game.getIns().on('render.numBox.clean',this.onNumBoxClean,this);

		Game.getIns().on('render.boomBox.boom',this.onBoomBoxBoom,this);

		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);


		Game.getIns().on('game.over',()=>{
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
		},this);
	}

	unbind(){
		
	}
}