Catpow.SelectTable=function({selections,value,onChange,spacer,col}){
	var i,items,rows=[];
	spacer=spacer || 0;
	col=col || 5;
	if(Array.isArray(selections)){
		items=selections.map((val)=>(
			<td className={val===value?'item active':'item'} onClick={()=>{
				onChange(val);
			}}>{val}</td>
		));
	}
	else{
		items=Object.keys(selections).map((key)=>(
			<td className={selections[key]===value?'item active':'item'} onClick={()=>{
				onChange(selections[key]);
			}}>{key}</td>
		));
	}
	for(i=0;i<spacer;i++){
		items.unshift(<td className="spacer"></td>);
	}
	for(i=(col-items.length%col)%col;i>0;i--){
		items.push(<td className="spacer"></td>);
	}
	for(i=0;i<items.length;i+=col){
		rows.push(items.slice(i,i+col));
	}
	return (
		<table className={"SelectTable"}>
			<tbody>
				{rows.map((row)=><tr>{row}</tr>)}
			</tbody>
		</table>
	);
}