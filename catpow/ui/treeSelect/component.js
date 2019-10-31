var TreeSelect = function (_wp$element$Component) {
	babelHelpers.inherits(TreeSelect, _wp$element$Component);

	function TreeSelect(props) {
		babelHelpers.classCallCheck(this, TreeSelect);

		var _this = babelHelpers.possibleConstructorReturn(this, (TreeSelect.__proto__ || Object.getPrototypeOf(TreeSelect)).call(this, props));

		_this.state = { checked1: false, checked2: false };
		return _this;
	}

	babelHelpers.createClass(TreeSelect, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var sels = this.props.selections;
			return wp.element.createElement(
				'ul',
				{ className: 'treeSelect' },
				Object.keys(sels).map(function (key) {
					var isActive = _this2.state.checked1 == key;
					return wp.element.createElement(
						'li',
						{
							className: isActive ? 'active' : 'normal',
							onClick: function onClick(e) {
								_this2.setState({ checked1: key });
							}
						},
						key,
						isActive && wp.element.createElement(
							'ul',
							null,
							Object.keys(sels[key]).map(function (childKey) {
								var isActive = _this2.state.checked2 == childKey;
								return wp.element.createElement(
									'li',
									{
										className: isActive ? 'active' : 'normal',
										onClick: function onClick(e) {
											_this2.setState({ checked2: childKey });
										}
									},
									childKey
								);
							})
						)
					);
				})
			);
		}
	}]);
	return TreeSelect;
}(wp.element.Component);
