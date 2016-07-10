/**
 * HubSp
 */
class HubSp extends egret.Sprite {
	
	boxCountStr:egret.TextField;
	statusStr:egret.TextField;


	totalCount:number;
	
	private _cleanCount : number;
	public get cleanCount() : number {
		return this._cleanCount;
	}
	public set cleanCount(v : number) {
		this._cleanCount = v;

		this.boxCountStr.text = `${this._cleanCount}-${this.totalCount}`;
	}


	
	private _status : string;
	public get status() : string {
		return this._status;
	}
	public set status(v : string) {
		this._status = v;
		this.statusStr.text = `${this._status}`;

		this.statusStr.textColor = {
			'playing':0x00ff00,
			'fail':0x222222,
			'win':0xff0000
		}[this._status];
		
	}
	
	

	constructor() {
		super();

		this.boxCountStr = new egret.TextField();
		this.statusStr = new egret.TextField();

		this.boxCountStr.x = 50;
		this.boxCountStr.y = 100;
		this.addChild(this.boxCountStr);

		this.statusStr.x = 640 - 150;
		this.statusStr.y = 100;
		this.status = 'playing';
		this.addChild(this.statusStr);



		this.bind()
	}

	bind(){
		Game.getIns().on('boomBox.boom',()=>{
			this.status = 'fail';
		},this);

		Game.getIns().on('game.pass',()=>{
			this.status = 'win';
		},this);

		Game.getIns().on('render.numBox.refreshCleanCount',(e)=>{
			this.cleanCount = e.data as number;
		},this)	
	}

}