Catpow.AmazonPay = function (_wp$element$Component) {
	babelHelpers.inherits(_class, _wp$element$Component);

	function _class(props) {
		babelHelpers.classCallCheck(this, _class);

		var _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

		_this.$ref = jQuery('#ZeusButtonContainer');
		_this.state = { popupOpen: false, canCheckout: false };
		return _this;
	}

	babelHelpers.createClass(_class, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    cart = _props.cart,
			    payment = _props.payment;
			var _state = this.state,
			    popupOpen = _state.popupOpen,
			    canCheckout = _state.canCheckout;


			var component = this;
			var popup_classes = "zeusPopup";
			if (popupOpen) {
				popup_classes += " open";
			}
			var checkoutbutton_classes = "zeusCheckoutButton";
			if (canCheckout) {
				checkoutbutton_classes += " active";
			}

			return [wp.element.createElement(
				"div",
				{
					id: "ZeusButton",
					onClick: function onClick() {
						zeusToken.getToken(function (zeus_token_response_data) {
							if (!zeus_token_response_data['result']) {
								alert(zeusToken.getErrorMessage(zeus_token_response_data['error_code']));
							} else {
								component.token_key = zeus_token_response_data.token_key;
								component.setState({ popupOpen: true });
							}
						});
					}
				},
				"\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9"
			), wp.element.createElement(
				"div",
				{ className: popup_classes },
				wp.element.createElement(
					"div",
					{ "class": "zeusPopupContent" },
					wp.element.createElement("div", { id: "zeus_token_card_info_area", className: "zeusWidget" }),
					wp.element.createElement(
						"div",
						{
							className: checkoutbutton_classes,
							onClick: function onClick(e) {
								if (!canCheckout) {
									return false;
								}
								cp_form_submit(component.$ref, component.props.action, function ($item, res) {
									console.log(res);
									this.setState({ popupOpen: false });
								}, { task: 'checkout', orderReferenceId: component.orderReferenceId });
							}
						},
						this.checkoutText
					),
					wp.element.createElement("div", { id: "zeusError" })
				)
			)];
		}
	}, {
		key: "renderButton",
		value: function renderButton() {
			zeusTokenStart();
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
