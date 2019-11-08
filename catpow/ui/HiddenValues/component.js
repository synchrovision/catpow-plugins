var HiddenValues = function (_wp$element$Component) {
	babelHelpers.inherits(HiddenValues, _wp$element$Component);

	function HiddenValues(props) {
		babelHelpers.classCallCheck(this, HiddenValues);
		return babelHelpers.possibleConstructorReturn(this, (HiddenValues.__proto__ || Object.getPrototypeOf(HiddenValues)).call(this, props));
	}

	babelHelpers.createClass(HiddenValues, [{
		key: 'render',
		value: function render() {
			var hiddenInput = function hiddenInput(name, val) {
				if (val instanceof Object) {
					return Object.keys(val).map(function (k) {
						return hiddenInput(name + '[' + k + ']', val[k]);
					});
				} else {
					return wp.element.createElement('input', { type: 'hidden', name: name, value: val });
				}
			};
			return wp.element.createElement(
				'div',
				{ className: 'hiddenValues' },
				hiddenInput(this.props.name, this.props.value)
			);
		}
	}]);
	return HiddenValues;
}(wp.element.Component);
