Catpow.DateSelect=class extends wp.element.Component{
	constructor(props) {
		super(props);
		var date,min,max,selections,i;
		
		if(props.value){date=new Date(props.value);}
		else if(props.default){date=new Date(props.default);}
		else{date=new Date();}
		if(props.min){min=new Date(props.min);}
		else{min=new Date(Date.now()-1000*3600*24*100);}
		if(props.max){max=new Date(props.max);}
		else{max=new Date(Date.now()+1000*3600*24*100);}
		
		selections={year:[],month:[],date:[]}
		for(i=min.getFullYear();i<=max.getFullYear();i++){
			selections.year.push(<option value={i+""}>{i+""}</option>);
		}
		for(i=0;i<12;i++){
			selections.month.push(<option value={i+""}>{(i+1)+""}</option>);
		}
		for(i=1;i<=31;i++){
			selections.date.push(<option value={i+""}>{i+""}</option>);
		}
		this.state={date,selections,min,max};
	}
	render(){
		var {date,min,max}=this.state;
		if(min>date){date=new Date(min);}
		else if(max<date){date=new Date(max);}
		else{date=new Date(date);}
		
		return (
			<div className={'DateSelect'}>
				<select onChange={(e)=>{date.setFullYear(e.target.value);this.setState({date});}} value={date.getFullYear()}>
					{this.state.selections.year}
				</select>
				<span class="unit">年</span>
				<select onChange={(e)=>{date.setMonth(e.target.value);this.setState({date});}} value={date.getMonth()}>
					{this.state.selections.month}
				</select>
				<span class="unit">月</span>
				<select onChange={(e)=>{date.setDate(e.target.value);this.setState({date});}} value={date.getDate()}>
					{this.state.selections.date}
				</select>
				<span class="unit">日</span>

				<Catpow.HiddenValues
					name={this.props.name}
					value={date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()}
				/>
			</div>
		);
	}
}