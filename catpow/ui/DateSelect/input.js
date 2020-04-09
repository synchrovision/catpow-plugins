Catpow.DateSelect = function (_wp$element$Component) {
	babelHelpers.inherits(_class, _wp$element$Component);

	function _class(props) {
		babelHelpers.classCallCheck(this, _class);

		var _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

		var date, min, max, selections, i;

		if (props.value) {
			date = new Date(props.value);
		} else if (props.default) {
			date = new Date(props.default);
		} else {
			date = false;
		}
		if (props.min) {
			min = new Date(props.min);
		} else {
			min = new Date(Date.now() - 1000 * 3600 * 24 * 100);
		}
		if (props.max) {
			max = new Date(props.max);
		} else {
			max = new Date(Date.now() + 1000 * 3600 * 24 * 100);
		}

		selections = {
			year: [wp.element.createElement(
				"option",
				{ value: -1 },
				"----"
			)],
			month: [wp.element.createElement(
				"option",
				{ value: -1 },
				"--"
			)],
			date: [wp.element.createElement(
				"option",
				{ value: -1 },
				"--"
			)]
		};
		for (i = min.getFullYear(); i <= max.getFullYear(); i++) {
			selections.year.push(wp.element.createElement(
				"option",
				{ value: i + "" },
				i + ""
			));
		}
		for (i = 0; i < 12; i++) {
			selections.month.push(wp.element.createElement(
				"option",
				{ value: i + "" },
				i + 1 + ""
			));
		}
		for (i = 1; i <= 31; i++) {
			selections.date.push(wp.element.createElement(
				"option",
				{ value: i + "" },
				i + ""
			));
		}
		_this.state = { date: date, selections: selections, min: min, max: max };
		return _this;
	}

	babelHelpers.createClass(_class, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var _state = this.state,
			    date = _state.date,
			    min = _state.min,
			    max = _state.max;

			if (date !== false) {
				if (min > date) {
					date = new Date(min);
				} else if (max < date) {
					date = new Date(max);
				} else {
					date = new Date(date);
				}
			}

			var nameInFunction = {
				Y: 'FullYear',
				m: 'Month',
				d: 'Date'
			};
			var setDate = function setDate(key, val) {
				if (val == -1) {
					date = false;
				} else {
					if (date === false) {
						date = new Date();
					}
					date['set' + nameInFunction[key]](val);
				}
				_this2.setState({ date: date });
			};
			var getDate = function getDate(key) {
				if (date === false) {
					return -1;
				}
				return date['get' + nameInFunction[key]]();
			};

			return wp.element.createElement(
				"div",
				{ className: 'DateSelect' },
				wp.element.createElement(
					"select",
					{ onChange: function onChange(e) {
							setDate('Y', e.target.value);
						}, value: getDate('Y') },
					this.state.selections.year
				),
				wp.element.createElement(
					"span",
					{ "class": "unit" },
					"\u5E74"
				),
				wp.element.createElement(
					"select",
					{ onChange: function onChange(e) {
							setDate('m', e.target.value);
						}, value: getDate('m') },
					this.state.selections.month
				),
				wp.element.createElement(
					"span",
					{ "class": "unit" },
					"\u6708"
				),
				wp.element.createElement(
					"select",
					{ onChange: function onChange(e) {
							setDate('d', e.target.value);
						}, value: getDate('d') },
					this.state.selections.date
				),
				wp.element.createElement(
					"span",
					{ "class": "unit" },
					"\u65E5"
				),
				date !== false && wp.element.createElement(Catpow.HiddenValues, {
					name: this.props.name,
					value: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				})
			);
		}
	}]);
	return _class;
}(wp.element.Component);
