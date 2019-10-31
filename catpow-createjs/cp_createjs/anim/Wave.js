/*
■使い方
距離に応じて各種オブジェクトに
特定のプロパティを加算する

■プロパティ
org 波の開始点{x,y}
dst 波の到達点{x,y}
tgt 操作対象オブジェクト
prp 操作対象プロパティ　初期値:z
amn 操作量　初期値:10
ptn 波の形 (r|l) 　初期値:r
spd 波の速さ (px/tick)　初期値:10
atn 波の距離による減衰 (%/px)　初期値:0%
age 開始からの経過時間　初期値:0

data 操作をあらかじめ計算した配列 [n:[{tgt,amn}...]

■メソッド
init
update

*/
function Wave(org,dst,tgt,prp,ptn,amn,spd,atn,age){
	this.org=org;
	this.dst=dst;
	this.tgt=tgt;
	this.prp=prp||'z';
	this.amn=amn||10;
	this.ptn=ptn||'r';
	this.spd=spd||10;
	this.atn=atn||0;
	this.age=age||0;
	this.init();
}
Wave.prototype.init=function(){
	this.data=[];
	var cv=function(v1,v2){return Math.abs(v1.x*v2.y-v2.x*v1.y);}
	var dv=function(v1,v2){return Math.sqrt(Math.pow(v1.x-v2.x,2)+Math.pow(v1.y-v2.y,2));}
	var rv=function(v1,v2,v3){return Math.atan2(v1.y-v2.y,v1.x-v2.y)-Math.atan2(v3.y-v2.y,v3.x-v2.y);}
	var lim=dv(this.org,this.dst)/this.spd;
	for(var i in this.tgt){
		if(this.ptn=='r'){var d=dv(this.org,this.tgt[i]);}else{var d=Math.abs(dv(this.org,this.tgt[i])*Math.cos(rv(this.tgt[i],this.org,this.dst)));}
		var t=Math.floor(d/this.spd);
		if(!this.data[t]){this.data[t]=[];}
		this.data[t].push({tgt:this.tgt[i],amn:this.amn*Math.pow(1-this.atn/100,d)});
	}
	var me=this;
	var handleTick=createjs.Ticker.on('tick',function(){
		if(me.data[me.age]){
			for(var i in me.data[me.age]){
				var d=me.data[me.age][i];
				d['tgt'][me.prp]+=d['amn'];
			}
		}
		if(me.age>lim){
			console.log(me.age);
			createjs.Ticker.off('tick',handleTick);
		}
		me.age++;
	});
}