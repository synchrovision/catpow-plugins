Catpow.AmazonPay=class extends wp.element.Component{
	constructor(props) {
		super(props);
		this.$ref=jQuery('#ZeusButtonContainer');
		this.state={popupOpen:false,canCheckout:false};
	}
	render(){
		var {cart,payment}=this.props;
		var {popupOpen,canCheckout}=this.state;
		
		var component=this;
		var popup_classes="zeusPopup";
		if(popupOpen){popup_classes+=" open";}
		var checkoutbutton_classes="zeusCheckoutButton";
		if(canCheckout){checkoutbutton_classes+=" active";}
		
		return [
			<div
				id="ZeusButton"
				onClick={()=>{
					zeusToken.getToken(function(zeus_token_response_data){
						if(!zeus_token_response_data['result']){
							alert(zeusToken.getErrorMessage(zeus_token_response_data['error_code']));
						}
						else{
							component.token_key=zeus_token_response_data.token_key;
							component.setState({popupOpen:true});
						}
					});
				}}
			>クレジットカード</div>,
			<div className={popup_classes}>
				<div class="zeusPopupContent">
					<div id="zeus_token_card_info_area" className="zeusWidget"></div>
					<div
						className={checkoutbutton_classes}
						onClick={(e)=>{
							if(!canCheckout){return false;}
							cp_form_submit(component.$ref,component.props.action,function($item,res){
								console.log(res);
								this.setState({popupOpen:false});
							},{task:'checkout',orderReferenceId:component.orderReferenceId});
						}}
					>{this.checkoutText}</div>
					<div id="zeusError"></div>
				</div>
			</div>
		];
	}
	renderButton(){
		zeusTokenStart();
	}
	
	componentDidMount(prevProps){
		this.renderButton();
	}
	
	componentDidUpdate(prevProps){
		//ボタンが消えていたら再レンダリングする処理が必要？
	}
}