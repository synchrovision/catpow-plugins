/*
■使い方
数値や座標、色数値の算出に使います
メソッドは全てstaticです

基本３文字の英字でデータ型や関数などを示します

is＝真偽値
obj＝オブジェクト

int＝整数
num＝数値

pnt＝Pointオブジェクト
mtx＝マトリックス

grd＝グラデーション
clr=色数値

rdm＝ランダム
seg＝線分
rnd＝円
bez=ベジェ
spl＝スプライン

ang=角度
drc＝方向
dst＝距離



■パブリックプロパティ

■パブリックメソッド
・数値
getBezVal(位置、数配列)　ベジェの特定の位置での値を求めます、数配列の数で何次ベジェか判断します
getComDiv(数値１、数値２)　二つの数の公約数を求めます
getComMul(数値１、数値２)　二つの数の公倍数を求めます
・点
isCrs(線１、線２)　　二つの点で定義された二つの線が交わるかのプール値を返します
getCrs(線１、線２)　　二つの点で定義された二つの線の交点を求めます、なければnullを返します
getPlrCrs(点１、角度１、点２、角度２)　点と角度で定義された二つの直線の交点を求めます　
・角度
getDrc(点１、点２)　点１と点２の角度を求めます
getAng(点１、点２、点３）　点１・２・３の成す角の内角を-π〜πのラジアンで求めます
getExAng(点１、点２、点３）　点１・２・３の成す角の外角を-π〜πのラジアンで求めます
・色
HSBtoRGB(色相,彩度,明度)　HSBの値から色数値を返します、あくまで近似値
RGBtoHSB(色数値)　H,S,Bの値を持つオブジェクトを返します、あくまで近似値

*/
Calc={
	//数
	avr:function(nums){
		var rtn=0
		for(var i=0;i<nums.length;i++){
			rtn+=nums[i]
		}
		rtn/=nums.length
		return rtn
	},
	comDiv:function(A,B) {
		var a=Math.max(A,B);
		var b=Math.min(A,B);
		while (a%b!==0) {
			var n=a%b;
			a=b;
			b=n;
		}
		return b;
	},
	comMul:function(A,B) {
		return A * B / comDiv(A,B);
	},
	//数配列
	ints:function(from,to,by=1){
		var rtn=new Array()
		for(var i=from;i<to;i+=by){
			rtn.push(i)
		}
		return rtn
	},
	nums:function(from,to,div=10){
		var rtn=new Array()
		var len=(to-from)/div
		for(var i=from;i<=to;i+=len){
			rtn.push(i)
		}
		return rtn
	},
	//ランダム
	rdmNums:function(n,w,len){
		var rtn=[]
		for(var i=0;i<len;i++){
			rtn.push(n+w*Math.random())
		}
		return rtn
	},
	//シャッフル
	sflInts:function(len){
		var rtn=new Array()
		for(var i=0;i<len;i++){
			rtn.splice((i+1)*Math.random()>>0,0,i)
		}
		return rtn
	},
	//セグメント
	segNum:function(nums,at=0.5){
		if(at<=0){
			return nums[0];
		}
		if(at>=1){
			return nums[nums.length-1];
		}
		var s=at*(nums.length-1)
		var n1=nums[Math.floor(s)]
		var n2=nums[Math.ceil(s)]
		return n1+(n2-n1)*(s%1)
	},
	segNums:function(nums,seg=10){
		var rtn=[]
		for(var i=0;i<=1;i+=1/seg){
			rtn.push(segNum(nums,i))
		}
		return rtn
	},
	//円
	rndNums:function(r,from=0,to=360,div=12){
		var rtn=[]
		for(var i=from;i<=to;i+=(to-from)/div){
			rtn.push(Math.sin(Math.PI/180*i)*r)
		}
		return rtn
	},
	rndPnts:function(r,from=0,to=360,div=12){
		var rtn=[]
		for(var i=from;i<=to;i+=(to-from)/div){
			rtn.push(new Point(Math.cos(Math.PI/180*i)*r,Math.sin(Math.PI/180*i)*r))
		}
		return rtn
	},
	//スプライン
	splNum:function(nums,at){
		if(at<=0){
			return nums[0]
			return
		}
		if(at>=1){
			return nums[nums.length-1]
			return
		}
		var i=Math.floor((nums.length-1)*at)
		var t=((nums.length-1)*at)%1
		var p1=nums[i]
		var p2=nums[i+1]
		if(t==0){
			return p1
			return
		}
		var v1=(i>0)?((nums[i+1]-nums[i-1])/2):(nums[i+1]-nums[i])
		var v2=(i<nums.length-2)?((nums[i+2]-nums[i])/2):(nums[i+1]-nums[i])
		return (2*p1-2*p2+v1+v2)*t*t*t+(-3*p1+3*p2-2*v1-v2)*t*t+v1*t+p1;
	},
	splPnt:function(pnts,at){
		if(at<=0){
			return pnts[0]
			return
		}
		if(at>=1){
			return pnts[pnts.length-1]
			return
		}
		var i=Math.floor((pnts.length-1)*at)
		var t=((pnts.length-1)*at)%1
		var p0,p1,p2,p3
		p0=(i>0)?(pnts[i-1]):(pnts[0].equals(pnts[pnts.length-1]))?(pnts[pnts.length-2]).interpolate(pnts[1],pnts[0],-1)
		p1=pnts[i]
		p2=pnts[i+1]
		p3=(i<pnts.length-2)?(pnts[i+2]):(pnts[0].equals(pnts[pnts.length-1]))?(pnts[1]).interpolate(pnts[i],pnts[i+1],-1)
		if(t==0){
			return p1
			return
		}
		var v1=p2.subtract(p0)
		var v2=p3.subtract(p1)
		v1.normalize(v1.length/2)
		v2.normalize(v2.length/2)
		return new Point(
						 (2*p1.x-2*p2.x+v1.x+v2.x)*t*t*t+(-3*p1.x+3*p2.x-2*v1.x-v2.x)*t*t+v1.x*t+p1.x,
						 (2*p1.y-2*p2.y+v1.y+v2.y)*t*t*t+(-3*p1.y+3*p2.y-2*v1.y-v2.y)*t*t+v1.y*t+p1.y)
	},
	splNums:function(nums,div){
		var rtn=new  Array()
		for(var i=0;i<=1;i+=1/div){
			rtn.push(splNum(nums,i))
		}
		return rtn
	},
	splPnts:function(pnts,div){
		var rtn=new Array()
		for(var i=0;i<=1;i+=1/div){
			rtn.push(splPnt(pnts,i))
		}
		return rtn
	},
	//ベジェ
	bezNum:function(nums,t){
		var rtn=0
		var n=nums.length-1
		rtn+=nums[0]*Math.pow((1-t),n)
		for(var i=1;i<n;i++){
			rtn+=nums[i]*Math.pow((1-t),n-i)*Math.pow(t,i)*n
		}
		rtn+=nums[n]*Math.pow(t,n)
		return rtn
	},
	bezPnt:function(pnts,t){
		var rtn=new Point()
		var n=pnts.length-1
		rtn.x+=pnts[0].x*Math.pow((1-t),n)
		rtn.y+=pnts[0].y*Math.pow((1-t),n)
		for(var i=1;i<n;i++){
			rtn.x+=pnts[i].x*Math.pow((1-t),n-i)*Math.pow(t,i)*n
			rtn.y+=pnts[i].y*Math.pow((1-t),n-i)*Math.pow(t,i)*n
		}
		rtn.x+=pnts[n].x*Math.pow(t,n)
		rtn.y+=pnts[n].y*Math.pow(t,n)
		return rtn
	},
	bezNums:function(nums,div){
		var rtn=new  Array()
		for(var i=0;i<=1;i+=1/div){
			rtn.push(bezNum(nums,i))
		}
		return rtn
	},
	bezPnts:function(pnts,div){
		var rtn=new Array()
		for(var i=0;i<=1;i+=1/div){
			rtn.push(bezPnt(pnts,i))
		}
		return rtn
	},
	//線の交差
	isCrs:function(lineA,lineB){
		var rtn=true
		if((ang(lineA[0],lineB[0],lineA[1])>0)==(ang(lineA[0],lineB[1],lineA[1])>0))rtn=false
		if((ang(lineB[0],lineA[0],lineB[1])>0)==(ang(lineB[0],lineA[1],lineB[1])>0))rtn=false
		return rtn
	},
	crsPnt:function(lineA,lineB){
		var rtn
		if(isCrs(lineA,lineB)){
			var vecA=lineA[1].subtract(lineA[0])
			var vecB=lineB[1].subtract(lineB[0])
			var f
			if(lineB[0].x==lineB[1].x){
				f=(lineB[0].x-lineA[0].x)/(lineA[1].x-lineA[0].x)
			}else{
				var dst1=Point.interpolate(lineB[1],lineB[0],(lineA[0].x-lineB[0].x)/(lineB[1].x-lineB[0].x)).subtract(lineA[0]).length
				var dst2=Point.interpolate(lineB[1],lineB[0],(lineA[1].x-lineB[0].x)/(lineB[1].x-lineB[0].x)).subtract(lineA[1]).length
				f=dst1/(dst1+dst2)
			}
			rtn=Point.interpolate(lineA[1],lineA[0],f)
		}
		return rtn
	},
	plrCrsPnt:function(PntA,RA,PntB,RB){
		if(PntA.equals(PntB)){
			return PntA.clone()
			return;
		}
		if(RA%Math.PI==RB%Math.PI){
			return null
			return;
		}
		var vec=PntB.subtract(PntA)
		var R=Math.atan2(vec.y,vec.x)+Math.PI/2
		var R1=R-RA
		var R2=RB-R
		return PntA.add(Point.polar(vec.length/(Math.tan(R1)+Math.tan(R2))/Math.cos(R1),RA))
	},
	//線の角度
	drc:function(Pnt1,Pnt2){
		Pnt1=Pnt1||new Point(0,0)
		var vec=Pnt2.subtract(Pnt1)
		var rtn=Math.atan2(vec.y,vec.x)
		while(rtn>Math.PI)rtn-=Math.PI*2
		while(rtn<-Math.PI)rtn+=Math.PI*2
		return rtn
	},
	ang:function(Pnt1,Pnt2,Pnt3) {
		if(Pnt1.equals(Pnt2)||Pnt3.equals(Pnt2)){
			return 0;
			return;
		}
		var rtn=Math.atan2(Pnt3.y - Pnt2.y,Pnt3.x - Pnt2.x) - Math.atan2(Pnt1.y - Pnt2.y,Pnt1.x - Pnt2.x);
		while (rtn > Math.PI) {
			rtn-= Math.PI * 2;
		}
		while (rtn < - Math.PI) {
			rtn+= Math.PI * 2;
		}
		return rtn;
	},
	exAng:function(Pnt1,Pnt2,Pnt3) {
		if(Pnt1.equals(Pnt2)||Pnt3.equals(Pnt2)){
			return 0;
			return;
		}
		var rtn=Math.atan2(Pnt3.y - Pnt2.y,Pnt3.x - Pnt2.x) - Math.atan2(Pnt1.y - Pnt2.y,Pnt1.x - Pnt2.x)-Math.PI;
		while (rtn > Math.PI) {
			rtn-= Math.PI * 2;
		}
		while (rtn < - Math.PI) {
			rtn+= Math.PI * 2;
		}
		return rtn;
	},
	//マトリックス
	mtx:function(org:*=null,s=1,r=0,tx=0,ty=0){
		var rtn=new Matrix()
		org=new Point(org.x||0,org.y||0)
		rtn.rotate(r)
		rtn.scale(s,s)
		MatrixTransformer.matchInternalPointWithExternal(rtn,org,org)
		rtn.translate(tx,ty)
		return rtn
	},
	rot3DMtx:function(rot=45,drc=45,org:*=null) {
		var rtn=new Matrix();
		org=new Point(org.x||org[0]||0,org.y||org[1]||0)
		var W=Math.cos(Math.PI/180*drc)
		var H=Math.sin(Math.PI/180*drc)
		var rad=Math.PI/180*rot
		var D=W*H*(H/W)/(W+H*(H/W))*(1-Math.cos(rad));
		with(rtn) {
			a=(W-D)/W;
			b=D*(W/H)/W;
			c=D/H;
			d=(H-D*(W/H))/H;
		}
		MatrixTransformer.matchInternalPointWithExternal(rtn,org,org)
		return rtn;
	},
	//グラデーションマトリックス
	grdMtxL:function(pnt1,pnt2){
		var rtn=new Matrix()
		var vec=pnt2.subtract(pnt1)
		var dst=vec.length
		var drc=Math.atan2(vec.y,vec.x)
		rtn.createGradientBox(dst,dst,0,0,0)
		rtn.rotate(drc)
		rtn.translate(pnt1.x,pnt1.y)
		return rtn
	},
	grdMtxR:function(pnt1,pnt2){
		var rtn=new Matrix()
		var vec=pnt2.subtract(pnt1)
		var dst=vec.length
		var drc=Math.atan2(vec.y,vec.x)
		rtn.createGradientBox(dst<<1,dst<<1,0,-dst,-dst)
		rtn.rotate(drc)
		rtn.translate(pnt1.x,pnt1.y)
		return rtn
	},
	//カラーマトリックス
	ctf:function(H=0,S=0,V=100,B=0,A=100){
		var rtn=new Color()
		S=Math.max(Math.min(S,100),-100)/100
		V=Math.max(Math.min(V,100),-100)/100
		B=Math.max(Math.min(B,100),-100)/100
		A=Math.max(Math.min(A,100),0)/100
		var t=Math.min(Math.abs(B),1)
		function r(n){return Math.min(1,Math.max(0,Math.abs(Math.abs(n%360)/60-3)-1))}
		rtn.redMultiplier=(1-S+r(H)*S)*V*(1-t)
		rtn.greenMultiplier=(1-S+r(H-120)*S)*V*(1-t)
		rtn.blueMultiplier=(1-S+r(H+120)*S)*V*(1-t)
		rtn.redOffset=rtn.greenOffset=rtn.blueOffset=Math.max(0,B*255)
		rtn.alphaMultiplier=A
		return rtn
	},
	//色
	RGBClr:function(R,G,B){
		return R*0x10000+G*0x100+B
	},
	RGBObj:function(clr){
		var rtn={R:0,G:0,B:0}
		rtn.R=clr>>16
		rtn.G=clr>>8&0xFF
		rtn.B=clr&0xFF
		return rtn
	},
	HSBClr:function(H,S,B) {
		var H=Math.abs(H%360)/60;
		while(H<0)H+=6
		var S=Math.min(Math.abs(S),100)/100
		var B=Math.min(Math.abs(B),100)/100
		var rtn=0x010101*Math.floor(B*(1-S)*255);
		var c=255*S*B;
		var r=0;
		var g=0;
		var b=0;
		if (H<1) {
			r=Math.floor(c);
			g=Math.floor(c*H);
		} else if (H<2) {
			r=Math.floor(c*(1-H%1));
			g=Math.floor(c);
		} else if (H<3) {
			g=Math.floor(c);
			b=Math.floor(c*(H%1));
		} else if (H<4) {
			g=Math.floor(c*(1-H%1));
			b=Math.floor(c);
		} else if (H<5) {
			b=Math.floor(c);
			r=Math.floor(c*(H%1));
		} else {
			b=Math.floor(c*(1-H%1));
			r=Math.floor(c);
		}
		rtn+=r*0x010000+g*0x0100+b;
		return rtn;
	},
	HSBObj:function(clr){
		var rtn={H:0,S:0,B:0}
		var rgb=RGBObj(clr)
		var r=rgb.R
		var g=rgb.G
		var b=rgb.B
		var min=Math.min(r,g,b)
		var max=Math.max(r,g,b)
		var mid=r+g+b-min-max
		var prog=(mid-min)/(max-min)
		rtn.B=max/0xFF*100
		rtn.S=(max-min)/max*100
		rtn.H=([r,g,b].indexOf(max)*120+360+(([r,g,b].lastIndexOf(mid)-[r,g,b].indexOf(max)+4)%3-1)*prog*60)%360
		return rtn
	},
	clrs:function(Hs,Ss,Bs){
		var rtn=[]
		var len=comMul(comMul(Hs.length,Ss.length),Bs.length)
		for(var i=1;i<Hs.length;i++){
			while(Hs[i-1]-Hs[i]>180)Hs[i]+=360
			while(Hs[i]-Hs[i-1]>180)Hs[i]-=360
		}
		Hs=segNums(Hs,len)
		Ss=segNums(Ss,len)
		Bs=segNums(Bs,len)
		for(i=0;i<len;i++){
			rtn.push(HSBClr(Hs[i],Ss[i],Bs[i]))
		}
		return rtn
	}
}