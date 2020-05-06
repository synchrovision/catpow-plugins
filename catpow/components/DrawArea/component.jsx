/**
* ドラッグによるアイテム操作のための汎用コンポーネント
* ドラッグ開始・ドラッグ・ドラッグ終了でオブジェクトを共有させる
*/
Catpow.DrawArea=function(props){
	var event;
	const {onCatch,onDraw,onRelease,grid,children,...otherProps}=props;
	
	const setEventData=(e)=>{
		event.x=e.clientX-event.areaRect.left;
		event.y=e.clientY-event.areaRect.top;
		event.path.push({x:event.x,y:event.y});
		event.tx=event.x-event.path[0].x;
		event.ty=event.y-event.path[0].y;
	};
	const moveItem=()=>{
		if(grid){
			event.item.style.transform="translate("+(Math.floor(event.tx/grid[0])*grid[0])+"px,"+(Math.floor(event.ty/grid[1])*grid[1])+"px)";
		}
		else{
			event.item.style.transform="translate("+event.tx+"px,"+event.ty+"px)";
		}
	}
	const resizeItem=()=>{
		if(grid){
			event.item.style.width=Math.floor((event.x-event.base.l)/grid[0])*grid[0]+"px";
		}
		else{
			event.item.style.width=(event.x-event.base.l)+"px";
		}
	}
	const resetItem=()=>{
		event.item.style.width=null;
		event.item.style.transform=null;
	}
	
	
	return (
		<div
			onMouseDown={(e)=>{
				const handler=e.target.closest('[data-drawaction]')
				if(!handler){event=false;return;}
				const item=e.target.closest('.item');
				const areaRect=e.currentTarget.getBoundingClientRect();
				const baseRect=item.getBoundingClientRect();
				event={
					item,
					handler,
					areaRect,
					baseRect,
					index:item.dataset.index,
					action:handler.dataset.drawaction,
					w:areaRect.width,
					h:areaRect.height,
					base:{
						l:baseRect.left-areaRect.left,
						c:baseRect.left+baseRect.width/2-areaRect.left,
						r:baseRect.right-areaRect.left,
						t:baseRect.top-areaRect.top,
						m:baseRect.top+baseRect.height/2-areaRect.top,
						b:baseRect.bottom-areaRect.bottom,
					},
					path:[],
					moveItem,
					resizeItem,
					resetItem
				};
				setEventData(e);
				onCatch(event);
			}}
			onMouseMove={(e)=>{
				if(!event){return;}
				setEventData(e);
				onDraw(event);
			}}
			onMouseUp={(e)=>{
				if(!event){return;}
				setEventData(e);
				onRelease(event);
				event=false;
			}}
			{...otherProps}
		>{children}</div>
	);
}