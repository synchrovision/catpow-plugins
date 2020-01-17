/*
絞り込み選択のUI
*/
Catpow.TreeSelect = function (_wp$element$Component) {
	babelHelpers.inherits(_class, _wp$element$Component);

	function _class(props) {
		babelHelpers.classCallCheck(this, _class);

		var _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

		var label,
		    states = [],
		    depth,
		    focus;
		var param = Object.assign({
			itemPerPage: 7,
			itemPerStep: 5
		}, props.param);
		if (props.value) {
			var setStates = function setStates(sels, val) {
				return Object.keys(sels).some(function (key) {
					if (sels[key] instanceof Object) {
						if (buildOpenPath(sels[key], val)) {
							states.unshift({
								selected: key,
								paged: 0
							});
							return true;
						}
						return false;
					}
					if (val == sels[key]) {
						states.unshift({
							selected: key,
							paged: 0
						});
						label = sels instanceof Array ? sels[key] : key;
						return true;
					}
					return false;
				});
			};
			buildOpenPath(props.selections, props.value);
			focus = states.length - 1;
		} else {
			focus = 0;
		}

		_this.state = {
			value: props.value,
			label: label,
			states: states,
			depth: depth,
			focus: focus,
			param: param
		};
		return _this;
	}

	babelHelpers.createClass(_class, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var sels = this.props.selections;

			var currentLabel,
			    currentLevel = this.state.openPath.length - 1;

			var items = this.state.openPath.map(function (key, i) {
				var crr = sels;
				sels = sels[key];
				var classes = 'selectBox level' + i;
				if (i == currentLevel) {
					classes += ' active';
				} else if (i == currentLevel - 1) {
					classes += ' prev';
				}
				return wp.element.createElement(
					'div',
					{ className: classes },
					i > 0 && wp.element.createElement(
						'div',
						{ className: 'backToPrev', onClick: function onClick(e) {
								_this2.setState({ openPath: _this2.state.openPath.slice(0, i) });
							} },
						' '
					),
					wp.element.createElement(
						'ul',
						{ className: 'selectBoxItems' },
						Object.keys(crr).map(function (k) {
							return wp.element.createElement(
								'li',
								{ className: 'selectBoxItem ' + (k == key ? 'selected' : '') },
								wp.element.createElement(
									'h3',
									{ onClick: function onClick(e) {
											var openPath = _this2.state.openPath.slice(0, i);
											openPath.push(k);
											if (crr[k] instanceof Object) {
												openPath.push('');
												_this2.setState({ openPath: openPath });
											} else {
												_this2.setState({
													value: crr[k],
													currentLabel: crr instanceof Array ? crr[k] : k,
													openPath: openPath
												});
											}
										} },
									crr instanceof Array ? crr[k] : k
								)
							);
						})
					)
				);
			});
			items.push(wp.element.createElement('div', { className: 'selectBox level' + (currentLevel + 1) + ' next' }));
			return wp.element.createElement(
				'div',
				{ className: 'treeSelect depth' + currentLevel },
				wp.element.createElement(
					'div',
					{ className: 'currentLabel' },
					wp.element.createElement(
						'h3',
						null,
						this.state.currentLabel
					)
				),
				wp.element.createElement(
					'div',
					{ className: 'selectBoxes' },
					items
				),
				wp.element.createElement(Catpow.HiddenValues, { name: this.props.name, value: this.state.value })
			);
		}
	}]);
	return _class;
}(wp.element.Component);
