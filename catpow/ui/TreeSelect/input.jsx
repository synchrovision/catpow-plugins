﻿/*
絞り込み選択のUI

*/
Catpow.TreeSelect=class extends wp.element.Component{
	constructor(props) {
		super(props);
		var currentLabel,openPath=[],depth,focus;
		var param=Object.assign({
			itemPerPage:7,
			itemPerStep:5
		},props.param);
		if(props.value){
			const buildOpenPath=(sels,val)=>{
				return Object.keys(sels).some(key=>{
					if(sels[key] instanceof Object){
						if(buildOpenPath(sels[key],val)){
							openPath.unshift({
								selected:key,
								paged:0
							});
							return true;
						}
						return false;
					}
					if(val==sels[key]){
						openPath.unshift({
							selected:key,
							paged:0
						});
						currentLabel=(sels instanceof Array)?sels[key]:key;
						return true;
					}
					return false;
				});
			};
			buildOpenPath(props.selections,props.value);
		}
		else{
			openPath=[''];
		}
		
		this.state={
			value:props.value,
			currentLabel,
			openPath,
			depth,
			param
		};
	}
	render(){
		var sels=this.props.selections;
		
		var currentLabel=this.state.currentLabel,currentLevel=this.state.openPath.length-1;
		
		var items=this.state.openPath.map((key,i)=>{
			var crr=sels;
			sels=sels[key] || [];
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
		
		var classes='treeSelect depth'+currentLevel;
		if(this.state.selecting){classes+=' selecting'}
		return (
			<div className={classes}>
				<div
					className="currentLabel"
					onClick={(e)=>{
						this.setState({selecting:!this.state.selecting});
					}}
				><h3>{currentLabel || this.props.defaultLabel}</h3></div>
				<div className="selectBoxes">{items}</div>
				<Catpow.HiddenValues name={this.props.name} value={this.state.value}/>
			</div>
		);
	}
}