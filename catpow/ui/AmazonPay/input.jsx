Catpow.AmazonPay=class extends wp.element.Component{
	constructor(props) {
		super(props);
		this.state={hoge:'hoge'};
	}
	render(){
		var {cart,payment}=this.props;
		
		return (
			<div id="AmazonPayButton"></div>
			<div id="addressBookWidgetDiv" style="height:250px"></div>
			<div id="walletWidgetDiv" style="height:250px"></div>
		);
	}
	renderButton(){
		OffAmazonPayments.Button("AmazonPayButton",amazonpay_config.merchant_id,{
			type: amazonpay_config.type,
			color: amazonpay_config.color,
			size: amazonpay_config.size,
			language: amazonpay_config.language,
			authorization:()=>{
				authRequest = amazon.Login.authorize(
					{ scope: "profile postal_code payments:widget payments:shipping_address", popup: true },
					(t)=>{
						console.log(t.access_token);
						console.log(t.expires_in);
						console.log(t.token_type);
						this.showAddressBookWidget();
              			this.showWalletWidget(orderReferenceId);
					}
				);
			},
			onError: function(error) {
				// something bad happened
			}
		});
	}
	

    showAddressBookWidget() {
        // AddressBook
        new OffAmazonPayments.Widgets.AddressBook({
          sellerId: amazonpay_config.merchant_id,
          
          onReady: function (orderReference) {
              var orderReferenceId = orderReference.getAmazonOrderReferenceId();
              var el;
              if ((el = document.getElementById("orderReferenceId"))) {
                el.value = orderReferenceId;
              }
              // Wallet
          },
          onAddressSelect: function (orderReference) {
              // お届け先の住所が変更された時に呼び出されます、ここで手数料などの再計算ができます。
          },
          design: {
              designMode: 'responsive'
          },
          onError: function (error) {
              // エラー処理 
              // エラーが発生した際にonErrorハンドラーを使って処理することをお勧めします。 
              // @see https://payments.amazon.com/documentation/lpwa/201954960
              console.log('OffAmazonPayments.Widgets.AddressBook', error.getErrorCode(), error.getErrorMessage());
              switch (error.getErrorCode()) {
                case 'AddressNotModifiable':
                    // オーダーリファレンスIDのステータスが正しくない場合は、お届け先の住所を変更することができません。
                    break;
                case 'BuyerNotAssociated':
                    // 購入者とリファレンスIDが正しく関連付けられていません。 
            　　　    // ウィジェットを表示する前に購入者はログインする必要があります。
                    break;
                case 'BuyerSessionExpired':
                    // 購入者のセッションの有効期限が切れました。 
       　　　　        // ウィジェットを表示する前に購入者はログインする必要があります。
                    break;
                case 'InvalidAccountStatus':
                    // マーチャントID（セラーID）がリクエストを実行する為に適切な状態ではありません。 
      　　　　         // 考えられる理由 ： 制限がかかっているか、正しく登録が完了されていません。
                    break;
                case 'InvalidOrderReferenceId':
                    // オーダーリファレンスIDが正しくありません。
                    break;
                case 'InvalidParameterValue':
                    // 指定されたパラメータの値が正しくありません。
                    break;
                case 'InvalidSellerId':
                    // マーチャントID（セラーID）が正しくありません。
                    break;
                case 'MissingParameter':
                    // 指定されたパラメータが正しくありません。
                    break;
                case 'PaymentMethodNotModifiable':
                    // オーダーリファレンスIDのステータスが正しくない場合はお支払い方法を変更することができません。
                    break;
                case 'ReleaseEnvironmentMismatch':
                    // 使用しているオーダーリファレンスオブジェクトがリリース環境と一致しません。
                    break;
                case 'StaleOrderReference':
                    // 使用しているオーダーリファレンスIDがキャンセルされています。 
                　　　// キャンセルされたオーダーリファレンスIDでウィジェットを関連付けすることはできません。
                    break;
                case 'UnknownError':
                    // 不明なエラーが発生しました。(UnknownError)
                    break;
                default:
                    // 不明なエラーが発生しました。
              }
          }
        }).bind("addressBookWidgetDiv");
    }

    showWalletWidget(orderReferenceId) {
        // Wallet
        new OffAmazonPayments.Widgets.Wallet({
          sellerId: amazonpay_config.merchant_id,
          amazonOrderReferenceId: orderReferenceId,
          onReady: function(orderReference) {
              console.log(orderReference.getAmazonOrderReferenceId());
          },
          onPaymentSelect: function() {
              console.log(arguments);
          },
          design: {
              designMode: 'responsive'
          },
          onError: function(error) {
              // エラー処理 
              // エラーが発生した際にonErrorハンドラーを使って処理することをお勧めします。 
              // @see https://payments.amazon.com/documentation/lpwa/201954960
              console.log('OffAmazonPayments.Widgets.Wallet', error.getErrorCode(), error.getErrorMessage());
          }
        }).bind("walletWidgetDiv");
    }
	
	componentDidMount(prevProps){
		this.renderButton();
	}
	
	componentDidUpdate(prevProps){
		//ボタンが消えていたら再レンダリングする処理が必要？
	}
}