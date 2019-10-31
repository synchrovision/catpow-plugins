/*
■使い方
zの値を0に戻そうとする点

■プロパティ
x
y
z

e　エネルギー

vis　粘度　エネルギーの減衰(%/tick)　初期値95%;
ela　弾性　元の位置に戻る力(%)　初期値10%;

■メソッド


*/

function Buoy(x,y,z,e,vis,ela){
	this.x=x;
	this.y=y;
	this.z=z||0;
	this.e=e||0;
	this.vis=vis||95;
	this.ela=ela||10;
	this.init();
}
Buoy.prototype=new createjs.Shape();
Buoy.prototype.init=function(){}
Buoy.prototype.update=function(){
	this.z+=this.e;
	this.e*=this.vis/100;
	this.e-=this.z*this.ela/100;
}