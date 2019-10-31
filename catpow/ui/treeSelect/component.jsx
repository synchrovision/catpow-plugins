class TreeSelect extends wp.element.Component{
	constructor(props) {
		super(props);
		this.state={checked1:false,checked2:false};
	}
	render(){
		var sels=this.props.selections;
		return (
			<ul className={'treeSelect'}>
				{Object.keys(sels).map(key=>{
					var isActive=this.state.checked1==key;
					return (
						<li
							className={isActive?'active':'normal'}
							onClick={e=>{this.setState({checked1:key})}}
						>
							{key}
							{isActive &&
								<ul>
									{Object.keys(sels[key]).map(childKey=>{
										var isActive=this.state.checked2==childKey;
										return (
											<li
												className={isActive?'active':'normal'}
												onClick={e=>{this.setState({checked2:childKey})}}
											>
												{childKey}
											</li>
										)
									})}
								</ul>
							}
						</li>
					);
				})}
			</ul>
		);
	}
}