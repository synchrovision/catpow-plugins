/*
絞り込み選択のUI

*/
Catpow.TreeSelect=class extends wp.element.Component{
	constructor(props) {
		super(props);
		var label,states=[],depth,focus;
		var param=Object.assign({
			itemPerPage:7,
			itemPerStep:5
		},props.param);
		if(props.value){
			const setStates=(sels,val)=>{
				return Object.keys(sels).some(key=>{
					if(sels[key] instanceof Object){
						if(buildOpenPath(sels[key],val)){
							states.unshift({
								selected:key,
								paged:0
							});
							return true;
						}
						return false;
					}
					if(val==sels[key]){
						states.unshift({
							selected:key,
							paged:0
						});
						label=(sels instanceof Array)?sels[key]:key;
						return true;
					}
					return false;
				});
			};
			buildOpenPath(props.selections,props.value);
			focus=states.length-1;
		}
		else{
			focus=0;
		}
		
		this.state={
			value:props.value,
			label,
			states,
			depth,
			focus,
			param
		};
	}
	render(){
		var sels=this.props.selections;
		
		var currentLabel,currentLevel=this.state.openPath.length-1;
		
		var items=this.state.openPath.map((key,i)=>{
			var crr=sels;
			sels=sels[key];
			var classes='selectBox level'+i;
			if(i==currentLevel){classes+=' active';}
			else if(i==currentLevel-1){classes+=' prev';}
			return (
				<div className={classes}>
					{i>0 &&
						<div className="backToPrev" onClick={(e)=>{
							this.setState({openPath:this.state.openPath.slice(0,i)});
						}}> </div>
					}
					<ul className='selectBoxItems'>
						{Object.keys(crr).map(k=>{
							return (
								<li className={'selectBoxItem '+(k==key?'selected':'')}>
									<h3 onClick={(e)=>{
										var openPath=this.state.openPath.slice(0,i);
										openPath.push(k);
										if(crr[k] instanceof Object){
											openPath.push('');
											this.setState({openPath});
										}
										else{
											this.setState({
												value:crr[k],
												currentLabel:(crr instanceof Array)?crr[k]:k,
												openPath
											});
										}
									}}>{(crr instanceof Array)?crr[k]:k}</h3>
								</li>
							)
						})}
					</ul>
				</div>
			);
		});
		items.push(<div className={'selectBox level'+(currentLevel+1)+' next'}></div>);
		return (
			<div className={'treeSelect depth'+currentLevel}>
				<div className="currentLabel"><h3>{this.state.currentLabel}</h3></div>
				<div className="selectBoxes">{items}</div>
				<Catpow.HiddenValues name={this.props.name} value={this.state.value}/>
			</div>
		);
	}
}