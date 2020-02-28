Catpow.AmazonPay = function (_wp$element$Component) {
	babelHelpers.inherits(_class, _wp$element$Component);

	function _class(props) {
		babelHelpers.classCallCheck(this, _class);

		var _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

		_this.state = { hoge: 'hoge' };
		return _this;
	}

	babelHelpers.createClass(_class, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    cart = _props.cart,
			    payment = _props.payment;


			return wp.element.createElement("div", { id: "AmazonPayButton" });
		}
	}, {
		key: "renderButton",
		value: function renderButton() {
			OffAmazonPayments.Button("AmazonPayButton", amazonpay_config.merchant_id, {
				type: amazonpay_config.type,
				color: amazonpay_config.color,
				size: amazonpay_config.size,
				language: amazonpay_config.language,
				authorization: function authorization() {
					authRequest = amazon.Login.authorize({ scope: "profile postal_code payments:widget payments:shipping_address", popup: true }, "SetPaymentDetails.php");
				},
				onError: function onError(error) {
					// something bad happened
				}
			});
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount(prevProps) {
			this.renderButton();
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps) {
			//ボタンが消えていたら再レンダリングする処理が必要？
		}
	}]);
	return _class;
}(wp.element.Component);
