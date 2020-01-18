jQuery(function($){if(!("AjaxZip3" in window)){$.getScript("https://ajaxzip3.github.io/ajaxzip3.js");}});

Catpow.ZipCode=class extends wp.element.Component{
	constructor(props) {
		super(props);
		this.secs0=React.createRef();
		this.secs1=React.createRef();
		this.state={value:props.value};
	}
	render(){
		var {value}=this.state;
		var secs=value.split('-');
		
		const input=(i)=>(
			<input
				type="text"
				size={["3","4"][i]}
				className={"sec"+i}
				onChange={(e)=>{
					var val=e.target.value;
					if(!val.match(/^\d+$/)){val='';}
					if(val.length==7){
						secs[0]=val.substring(0,3);
						secs[2]=val.substring(3);
					}
					else{
						secs[i]=val;
						if(i==0 && val.length>2){
							this.secs1.current.focus();
						}
					}
					AjaxZip3.zip2addr(this.secs0.current,this.secs1.current,this.props.pref,this.props.addr);
					this.setState({value:secs.join('-')});
				}}
				ref={this['secs'+i]}
				value={secs[i]}
			/>
		);
		
		
		return (
			<div className={'ZipCode'}>
				{input(0)}
				<span class="sep">-</span>
				{input(1)}

				<Catpow.HiddenValues
					name={this.props.name}
					value={value}
				/>
			</div>
		);
	}
}