var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CP = {

	selectImage: function selectImage(keys, set, size) {
		if (CP.uploder === undefined) {
			CP.uploader = wp.media({
				title: 'Select Image',
				button: { text: 'Select' },
				multiple: false
			});
		}
		CP.uploader.off('select').on('select', function () {
			var image = CP.uploader.state().get('selection').first().toJSON();
			var data = {};
			if (keys.mime) {
				data[keys.mime] = image.mime;
			}
			if (size && image.sizes && image.sizes[size]) {
				data[keys.src] = image.sizes[size].url;
			} else {
				data[keys.src] = image.url;
			}
			if (keys.alt) {
				data[keys.alt] = image.alt;
			}
			if (keys.srcset && image.sizes) {
				data[keys.srcset] = image.sizes.medium_large.url + ' 480w,' + image.url;
			}
			set(data);
		}).open();
	},
	parseCSV: function parseCSV(csv) {
		var tmp = [];
		csv = csv.replace(/("[^"]*")+/g, function (match) {
			tmp.push(match.slice(1, -1).replace(/""/g, '"'));return '[TMP]';
		});
		return csv.split("\n").map(function (row) {
			return row.split(',').map(function (val) {
				return val === '[TMP]' ? tmp.shift() : val;
			});
		});
	},

	switchColor: function switchColor(_ref, value) {
		var set = _ref.set,
		    attr = _ref.attr;

		var classArray = attr.classes.split(' ');
		var i = classArray.findIndex(function (cls) {
			return cls.substr(0, 5) === 'color';
		});
		if (i === -1) {
			if (value) {
				classArray.push('color' + value);
			}
		} else {
			if (value) {
				classArray.splice(i, 1, 'color' + value);
			} else {
				classArray.splice(i, 1);
			}
		}
		set({ classes: classArray.join(' ') });
	},
	getColor: function getColor(_ref2) {
		var attr = _ref2.attr;

		var value = attr.classes.split(' ').find(function (cls) {
			return cls.substr(0, 5) === 'color';
		});
		if (!value) {
			return 0;
		}
		return parseInt(value.substr(5));
	},

	switchPattern: function switchPattern(_ref3, value) {
		var set = _ref3.set,
		    attr = _ref3.attr;

		var classArray = attr.classes.split(' ');
		var i = classArray.findIndex(function (cls) {
			return cls.substr(0, 7) === 'pattern';
		});
		if (i === -1) {
			if (value) {
				classArray.push('pattern' + value);
			}
		} else {
			if (value) {
				classArray.splice(i, 1, 'pattern' + value);
			} else {
				classArray.splice(i, 1);
			}
		}
		set({ classes: classArray.join(' ') });
	},
	getPattern: function getPattern(_ref4) {
		var attr = _ref4.attr;

		var value = attr.classes.split(' ').find(function (cls) {
			return cls.substr(0, 7) === 'pattern';
		});
		if (!value) {
			return 0;
		}
		return parseInt(value.substr(7));
	},

	switchSelectiveClass: function switchSelectiveClass(_ref5, values, value, key) {
		var set = _ref5.set,
		    attr = _ref5.attr;

		if (key === undefined) {
			key = 'classes';
		}
		var classArray = attr[key].split(' ');
		if (!Array.isArray(values) && _.isObject(values)) {
			values = Object.keys(values);
		}
		classArray = _.difference(classArray, values);
		if (Array.isArray(value)) {
			classArray = classArray.concat(value);
		} else {
			classArray.push(value);
		}
		var data = {};
		data[key] = classArray.join(' ');
		set(data);
	},
	getSelectiveClass: function getSelectiveClass(_ref6, values, key) {
		var attr = _ref6.attr;

		if (key === undefined) {
			key = 'classes';
		}
		if (attr[key] === undefined) {
			attr[key] = '';
		}
		var classArray = attr[key].split(' ');
		if (!Array.isArray(values) && _.isObject(values)) {
			values = Object.keys(values);
		}
		return _.intersection(classArray, values).shift();
	},

	getSubClasses: function getSubClasses(prm) {
		var rtn = {};
		var values = void 0;
		if (Array.isArray(prm.values)) {
			values = prm.values;
		} else {
			values = Object.keys(prm.values);
		}
		values.map(function (val) {
			if (prm.sub && prm.sub[val]) {
				rtn[val] = CP.getAllSubClasses(prm.sub[val]);
			} else {
				rtn[val] = [];
			}
		});
		return rtn;
	},
	getAllSubClasses: function getAllSubClasses(prms) {
		var rtn = [];
		prms.map(function (prm) {
			if ((typeof prm === 'undefined' ? 'undefined' : _typeof(prm)) === 'object') {
				if (prm.values) {
					if (Array.isArray(prm.values)) {
						rtn = rtn.concat(prm.values);
					} else if (_.isObject(prm.values)) {
						rtn = rtn.concat(Object.keys(prm.values));
					} else {
						rtn.push(prm.values);
					}
				}
				if (prm.sub) {
					if (Array.isArray(prm.sub)) {
						rtn = rtn.concat(CP.getAllSubClasses(prm.sub));
					} else {
						Object.keys(prm.sub).map(function (key) {
							rtn = rtn.concat(CP.getAllSubClasses(prm.sub[key]));
						});
					}
				}
			}
		});
		return rtn;
	},
	getBindClasses: function getBindClasses(prm) {
		var rtn = {};
		var values = void 0;
		if (Array.isArray(prm.values)) {
			values = prm.values;
		} else {
			values = Object.keys(prm.values);
		}
		values.map(function (val) {
			if (prm.bind && prm.bind[val]) {
				rtn[val] = prm.bind[val];
			} else {
				rtn[val] = [];
			}
		});
		return rtn;
	},

	toggleClass: function toggleClass(_ref7, value, key) {
		var attr = _ref7.attr,
		    set = _ref7.set;

		if (key === undefined) {
			key = 'classes';
		}
		if (attr[key] === undefined) {
			attr[key] = '';
		}
		var classArray = attr[key].split(' ');
		var i = classArray.indexOf(value);
		if (i === -1) {
			classArray.push(value);
		} else {
			classArray.splice(i, 1);
		}
		var data = {};
		data[key] = classArray.join(' ');
		set(data);
	},
	hasClass: function hasClass(_ref8, value, key) {
		var attr = _ref8.attr;

		if (key === undefined) {
			key = 'classes';
		}
		if (attr[key] === undefined) {
			attr[key] = '';
		}
		return attr[key].split(' ').indexOf(value) !== -1;
	},

	selectPrevItem: function selectPrevItem(tag) {
		jQuery(window.getSelection().anchorNode).closest(tag).prev().find('[contentEditable]').get(0).focus();
	},
	selectNextItem: function selectNextItem(tag) {
		jQuery(window.getSelection().anchorNode).closest(tag).next().find('[contentEditable]').get(0).focus();
	},
	saveItem: function saveItem(_ref9) {
		var items = _ref9.items,
		    index = _ref9.index,
		    set = _ref9.set;

		set({ items: items });
	},
	deleteItem: function deleteItem(_ref10) {
		var items = _ref10.items,
		    index = _ref10.index,
		    set = _ref10.set;

		items.splice(index, 1);
		set({ items: items });
	},
	cloneItem: function cloneItem(_ref11) {
		var tag = _ref11.tag,
		    items = _ref11.items,
		    index = _ref11.index,
		    set = _ref11.set;

		items.splice(index, 0, jQuery.extend(true, {}, items[index]));
		set({ items: items });
		CP.selectNextItem(tag);
	},
	upItem: function upItem(_ref12) {
		var tag = _ref12.tag,
		    items = _ref12.items,
		    index = _ref12.index,
		    set = _ref12.set;

		if (!items[index - 1]) return false;
		items.splice(index - 1, 2, items[index], items[index - 1]);
		set({ items: items });
		CP.selectPrevItem(tag);
	},
	downItem: function downItem(_ref13) {
		var tag = _ref13.tag,
		    items = _ref13.items,
		    index = _ref13.index,
		    set = _ref13.set;

		if (!items[index + 1]) return false;
		items.splice(index, 2, items[index + 1], items[index]);
		set({ items: items });
		CP.selectNextItem(tag);
	},

	switchItemColor: function switchItemColor(_ref14, color, itemsKey) {
		var items = _ref14.items,
		    index = _ref14.index,
		    set = _ref14.set;

		if (itemsKey === undefined) {
			itemsKey = 'items';
		}
		var classArray = items[index].classes.split(' ');
		var i = classArray.findIndex(function (cls) {
			return cls.substr(0, 5) === 'color';
		});
		if (i === -1) {
			if (color) {
				classArray.push('color' + color);
			}
		} else {
			if (color) {
				classArray.splice(i, 1, 'color' + color);
			} else {
				classArray.splice(i, 1);
			}
		}
		items[index].classes = classArray.join(' ');
		set(_defineProperty({}, itemsKey, items));
	},
	getItemColor: function getItemColor(_ref15) {
		var items = _ref15.items,
		    index = _ref15.index;

		var c = items[index].classes.split(' ').find(function (cls) {
			return cls.substr(0, 5) === 'color';
		});
		if (!c) {
			return 0;
		}
		return parseInt(c.substr(5));
	},

	switchItemPattern: function switchItemPattern(_ref16, pattern, itemsKey) {
		var items = _ref16.items,
		    index = _ref16.index,
		    set = _ref16.set;

		if (itemsKey === undefined) {
			itemsKey = 'items';
		}
		var classArray = items[index].classes.split(' ');
		var i = classArray.findIndex(function (cls) {
			return cls.substr(0, 7) === 'pattern';
		});
		if (i === -1) {
			if (pattern) {
				classArray.push('pattern' + pattern);
			}
		} else {
			if (pattern) {
				classArray.splice(i, 1, 'pattern' + pattern);
			} else {
				classArray.splice(i, 1);
			}
		}
		items[index].classes = classArray.join(' ');
		set(_defineProperty({}, itemsKey, items));
	},
	getItemPattern: function getItemPattern(_ref17) {
		var items = _ref17.items,
		    index = _ref17.index;

		var p = items[index].classes.split(' ').find(function (cls) {
			return cls.substr(0, 7) === 'pattern';
		});
		if (!p) {
			return 0;
		}
		return parseInt(p.substr(7));
	},

	switchItemSelectiveClass: function switchItemSelectiveClass(_ref18, values, value, itemsKey) {
		var items = _ref18.items,
		    index = _ref18.index,
		    set = _ref18.set;

		if (itemsKey === undefined) {
			itemsKey = 'items';
		}
		var classArray = items[index].classes.split(' ');
		if (!Array.isArray(values) && _.isObject(values)) {
			values = Object.keys(values);
		}
		classArray = _.difference(classArray, values);
		if (Array.isArray(value)) {
			classArray = classArray.concat(value);
		} else {
			classArray.push(value);
		}
		items[index].classes = classArray.join(' ');
		set(_defineProperty({}, itemsKey, items));
	},
	getItemSelectiveClass: function getItemSelectiveClass(_ref19, values) {
		var items = _ref19.items,
		    index = _ref19.index;

		if (!items[index].classes) {
			return false;
		}
		var classArray = items[index].classes.split(' ');
		if (!Array.isArray(values) && _.isObject(values)) {
			values = Object.keys(values);
		}
		return _.intersection(classArray, values).shift();
	},

	toggleItemClass: function toggleItemClass(_ref20, value, itemsKey) {
		var items = _ref20.items,
		    index = _ref20.index,
		    set = _ref20.set;

		if (itemsKey === undefined) {
			itemsKey = 'items';
		}
		var classArray = items[index].classes.split(' ');
		var i = classArray.indexOf(value);
		if (i === -1) {
			classArray.push(value);
		} else {
			classArray.splice(i, 1);
		}
		items[index].classes = classArray.join(' ');
		set(_defineProperty({}, itemsKey, items));
	},
	hasItemClass: function hasItemClass(_ref21, value) {
		var items = _ref21.items,
		    index = _ref21.index;

		var classArray = items[index].classes.split(' ');
		return classArray.indexOf(value) !== -1;
	},

	getJsonValue: function getJsonValue(_ref22, json, key) {
		var attr = _ref22.attr;

		if (!attr[json]) {
			return null;
		}
		return JSON.parse(attr[json])[key];
	},
	hasJsonValue: function hasJsonValue(prop, json, key, value) {
		var values = CP.getJsonValue(prop, json, key);
		if (!values) {
			return false;
		}
		return values.indexOf(value) !== -1;
	},
	setJsonValue: function setJsonValue(_ref23, json, key, value) {
		var attr = _ref23.attr,
		    set = _ref23.set;

		var data = {};
		var jsonData = JSON.parse(attr[json]);
		jsonData[key] = value;
		data[json] = JSON.stringify(jsonData);
		set(data);
	},
	switchJsonValue: function switchJsonValue(prop, json, key, value) {
		var values = CP.getJsonValue(prop, json, key);
		if (!values) {
			values = [];
		}
		var i = values.indexOf(value);
		if (i === -1) {
			values.push(value);
		} else {
			values.splice(i, 1);
		}
		CP.setJsonValue(prop, json, key, values);
	}
};
var SelectResponsiveImage = function SelectResponsiveImage(_ref24) {
	var attr = _ref24.attr,
	    set = _ref24.set,
	    keys = _ref24.keys,
	    index = _ref24.index,
	    sizes = _ref24.sizes,
	    size = _ref24.size;

	var type = void 0,
	    onClick = void 0,
	    item = void 0;
	if (keys.items) {
		item = attr[keys.items][index];
		onClick = function onClick(e) {
			return CP.selectImage(keys, function (data) {
				var rusult = {};
				rusult[keys.items] = attr[keys.items].map(function (obj) {
					return jQuery.extend(true, {}, obj);
				});
				rusult[keys.items][index] = jQuery.extend({}, item, data);
				set(rusult);
			}, size);
		};
	} else {
		item = attr;
		onClick = function onClick(e) {
			return CP.selectImage(keys, set);
		};
	}
	if (item[keys.mime]) {
		type = item[keys.mime].split('/')[0];
	} else {
		type = 'image';
	}
	if (type == 'audio') {
		return wp.element.createElement('audio', {
			className: 'selectImage',
			src: item[keys.src],
			'data-mime': item[keys.mime],
			onClick: onClick
		});
	}
	if (item[keys.srcset] && !sizes) {
		sizes = '(max-width:640px) 480px,100vw';
	}
	if (type == 'video') {
		return wp.element.createElement('video', {
			className: 'selectImage',
			src: item[keys.src],
			'data-mime': item[keys.mime],
			onClick: onClick,
			autoplay: 1,
			loop: 1,
			playsinline: 1,
			muted: 1
		});
	}
	return wp.element.createElement('img', {
		className: 'selectImage',
		src: item[keys.src] || cp.theme_url + '/images/dummy.jpg',
		alt: item[keys.alt],
		srcset: item[keys.srcset],
		sizes: sizes,
		'data-mime': item[keys.mime],
		onClick: onClick
	});
};
var ResponsiveImage = function ResponsiveImage(_ref25) {
	var attr = _ref25.attr,
	    keys = _ref25.keys,
	    index = _ref25.index,
	    sizes = _ref25.sizes;

	var type = void 0,
	    item = void 0;
	if (keys.items) {
		item = attr[keys.items][index];
	} else {
		item = attr;
	}
	if (item[keys.mime]) {
		type = item[keys.mime].split('/')[0];
	} else {
		type = 'image';
	}
	if (type == 'audio') {
		return wp.element.createElement('audio', {
			src: item[keys.src],
			'data-mime': item[keys.mime]
		});
	}
	if (item[keys.srcset] && !sizes) {
		sizes = '(max-width:640px) 480px,100vw';
	}
	if (type == 'video') {
		return wp.element.createElement('video', {
			src: item[keys.src],
			srcset: item[keys.srcset],
			sizes: sizes,
			'data-mime': item[keys.mime],
			autoplay: 1,
			loop: 1,
			playsinline: 1,
			muted: 1
		});
	}
	return wp.element.createElement('img', {
		src: item[keys.src],
		alt: item[keys.alt],
		srcset: item[keys.srcset],
		sizes: sizes,
		'data-mime': item[keys.mime]
	});
};

var Item = function Item(props) {
	var tag = props.tag,
	    items = props.items,
	    index = props.index,
	    set = props.set,
	    children = props.children;

	if (!items[index].classes) {
		items[index].classes = 'item';
	} else if (items[index].classes.search(/\bitem\b/) === -1) {
		items[index].classes += ' item';
	}
	var classes = items[index].classes;
	if (props.className) {
		classes += ' ' + props.className;
	}
	return wp.element.createElement(tag, {
		className: classes,
		"data-refine-cond": items[index]['cond'],
		onKeyDown: function onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case 's':
						CP.saveItem(props);e.preventDefault();break;
					case 'd':
						CP.cloneItem(props);e.preventDefault();break;
					case 'Backspace':
						CP.deleteItem(props);e.preventDefault();break;
					case 'ArrowUp':
						CP.upItem(props);e.preventDefault();break;
					case 'ArrowDown':
						CP.downItem(props);e.preventDefault();break;
				}
			}
		}
	}, children);
};
var ItemControl = function ItemControl(props) {
	var items = props.items,
	    itemsKey = props.itemsKey,
	    index = props.index,
	    set = props.set,
	    attr = props.attr,
	    triggerClasses = props.triggerClasses;
	var itemClasses = props.itemClasses;

	var toggleItemControl = function toggleItemControl() {
		items[index].openControl = !items[index].openControl;
		if (itemsKey === undefined) {
			set({ items: items });
		} else {
			set(_defineProperty({}, itemsKey, items));
		}
	};
	if (triggerClasses && triggerClasses.item) {
		itemClasses = triggerClasses.item[CP.getSelectiveClass(props, triggerClasses.values)];
		if (Array.isArray(itemClasses) && itemClasses.length === 0) {
			itemClasses = false;
		}
	}

	var classes = 'itemControl';
	if (items[index].openControl) {
		classes += ' open';
	}

	var selectItemClass = function selectItemClass(prm) {
		var rtn = [];
		if (prm === 'color') {
			rtn.push(wp.element.createElement(RangeControl, {
				label: '\u8272',
				onChange: function onChange(clr) {
					return CP.switchItemColor(props, clr, itemsKey);
				},
				value: CP.getItemColor(props),
				min: 0,
				max: 12
			}));
		} else if (prm === 'pattern') {
			rtn.push(wp.element.createElement(RangeControl, {
				label: '\u30D1\u30BF\u30FC\u30F3',
				onChange: function onChange(clr) {
					return CP.switchItemPattern(props, clr, itemsKey);
				},
				value: CP.getItemPattern(props),
				min: 0,
				max: 5
			}));
		} else if (prm === 'cond') {
			rtn.push(wp.element.createElement(TextareaControl, {
				label: '\u8868\u793A\u6761\u4EF6',
				value: items[index]['cond'],
				onChange: function onChange(cond) {
					items[index]['cond'] = cond;
					if (itemsKey === undefined) {
						set({ items: items });
					} else {
						set(_defineProperty({}, itemsKey, items));
					}
				}
			}));
		} else if (_.isObject(prm.values)) {
			var options = void 0;
			if (Array.isArray(prm.values)) {
				options = prm.values.map(function (cls) {
					return { label: cls, value: cls };
				});
			} else {
				options = Object.keys(prm.values).map(function (cls) {
					return { label: prm.values[cls], value: cls };
				});
			}
			rtn.push(wp.element.createElement(SelectControl, {
				label: prm.label,
				onChange: function onChange(cls) {
					return CP.switchItemSelectiveClass(props, prm.values, cls, itemsKey);
				},
				value: CP.getItemSelectiveClass(props, prm.values),
				options: options
			}));
			if (prm.sub) {
				var currentClass = CP.getItemSelectiveClass(props, prm.values);
				if (currentClass && prm.sub[currentClass]) {
					var sub = [];
					prm.sub[currentClass].map(function (prm) {
						sub.push(SelectItemClass(prm));
					});
					rtn.push(wp.element.createElement(
						'div',
						{ className: 'sub' },
						sub
					));
				}
			}
		} else {
			rtn.push(wp.element.createElement(CheckboxControl, {
				label: prm.label,
				onChange: function onChange() {
					CP.toggleItemClass(props, prm.values, itemsKey);
				},
				checked: CP.hasItemClass(props, prm.values)
			}));
			if (prm.sub) {
				if (CP.hasItemClass(props, prm.values)) {
					var _sub = [];
					prm.sub.map(function (prm) {
						_sub.push(selectItemClass(prm));
					});
					rtn.push(wp.element.createElement(
						'div',
						{ className: 'sub' },
						_sub
					));
				}
			}
		}
		return rtn;
	};

	return wp.element.createElement(
		'div',
		{ className: classes },
		wp.element.createElement('div', { className: 'btn delete', onClick: function onClick(e) {
				return CP.deleteItem(props);
			} }),
		wp.element.createElement('div', { className: 'btn clone', onClick: function onClick(e) {
				return CP.cloneItem(props);
			} }),
		wp.element.createElement('div', { className: 'btn up', onClick: function onClick(e) {
				return CP.upItem(props);
			} }),
		wp.element.createElement('div', { className: 'btn down', onClick: function onClick(e) {
				return CP.downItem(props);
			} }),
		itemClasses && wp.element.createElement('div', { className: 'btn edit', onClick: function onClick(e) {
				return toggleItemControl();
			} }),
		itemClasses && wp.element.createElement(
			'div',
			{ 'class': 'inputs' },
			itemClasses.map(selectItemClass)
		)
	);
};
var ItemControlInfoPanel = function ItemControlInfoPanel() {
	return wp.element.createElement(
		PanelBody,
		{ title: '\u64CD\u4F5C', initialOpen: false, icon: 'info' },
		wp.element.createElement(
			'table',
			null,
			wp.element.createElement(
				'tbody',
				null,
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'th',
						null,
						'\u2318/Ctrl + S'
					),
					wp.element.createElement(
						'td',
						null,
						'\u4FDD\u5B58'
					)
				),
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'th',
						null,
						'\u2318/Ctrl + D'
					),
					wp.element.createElement(
						'td',
						null,
						'\u8907\u88FD'
					)
				),
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'th',
						null,
						'\u2318/Ctrl + delete'
					),
					wp.element.createElement(
						'td',
						null,
						'\u524A\u9664'
					)
				),
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'th',
						null,
						'\u2318/Ctrl + \u2191'
					),
					wp.element.createElement(
						'td',
						null,
						'\u524D\u306E\u30A2\u30A4\u30C6\u30E0\u3068\u5165\u308C\u66FF\u3048'
					)
				),
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'th',
						null,
						'\u2318/Ctrl + \u2193'
					),
					wp.element.createElement(
						'td',
						null,
						'\u6B21\u306E\u30A2\u30A4\u30C6\u30E0\u3068\u5165\u308C\u66FF\u3048'
					)
				)
			)
		)
	);
};

var SelectClassPanel = function SelectClassPanel(props) {
	var SelectClass = function SelectClass(prm) {
		var rtn = [];
		if (prm.json) {
			if (prm.input) {
				switch (prm.input) {
					case 'text':
						rtn.push(wp.element.createElement(TextControl, {
							label: prm.label,
							value: JSON.parse(props.attr[prm.json])[prm.key],
							onChange: function onChange(val) {
								CP.setJsonValue(props, prm.json, prm.key, val);
							}
						}));
						break;
					case 'range':
						if (!prm.coef) {
							prm.coef = 1;
						}
						rtn.push(wp.element.createElement(RangeControl, {
							label: prm.label,
							value: CP.getJsonValue(props, prm.json, prm.key) / prm.coef,
							onChange: function onChange(val) {
								CP.setJsonValue(props, prm.json, prm.key, val * prm.coef);
							},
							min: prm.min,
							max: prm.max
						}));
						break;

				}
			} else if (_.isObject(prm.values)) {
				var options = void 0,
				    values = void 0;
				if (Array.isArray(prm.values)) {
					values = prm.values;
					options = prm.values.map(function (cls) {
						return { label: cls, value: cls };
					});
				} else {
					values = Object.keys(prm.values);
					options = values.map(function (cls) {
						return { label: prm.values[cls], value: cls };
					});
				}
				rtn.push(wp.element.createElement(SelectControl, {
					label: prm.label,
					value: CP.getJsonValue(props, prm.json, prm.key),
					onChange: function onChange(val) {
						CP.setJsonValue(props, prm.json, prm.key, val);
					},
					options: options
				}));
			} else if (prm.values) {
				rtn.push(wp.element.createElement(CheckboxControl, {
					label: prm.label,
					onChange: function onChange() {
						CP.switchJsonValue(props, prm.json, prm.key, prm.values);
					},
					checked: CP.hasJsonValue(props, prm.json, prm.key, prm.values)
				}));
			} else {
				rtn.push(wp.element.createElement(TextControl, {
					label: prm.label,
					value: JSON.parse(props.attr[prm.json])[prm.key],
					onChange: function onChange(val) {
						CP.setJsonValue(props, prm.json, prm.key, val);
					}
				}));
			}
		} else {
			if (prm === 'color') {
				rtn.push(wp.element.createElement(RangeControl, {
					label: '\u8272',
					onChange: function onChange(clr) {
						return CP.switchColor(props, clr);
					},
					value: CP.getColor(props),
					min: 0,
					max: 12
				}));
			} else if (prm === 'pattern') {
				rtn.push(wp.element.createElement(RangeControl, {
					label: '\u30D1\u30BF\u30FC\u30F3',
					onChange: function onChange(clr) {
						return CP.switchPattern(props, clr);
					},
					value: CP.getPattern(props),
					min: 0,
					max: 5
				}));
			} else if (prm.input) {
				switch (prm.input) {
					case 'text':
						rtn.push(wp.element.createElement(TextControl, {
							label: prm.label,
							value: props.attr[prm.key],
							onChange: function onChange(val) {
								var data = {};data[prm.key] = val;props.set(data);
							}
						}));
						break;
					case 'range':
						if (!prm.coef) {
							prm.coef = 1;
						}
						rtn.push(wp.element.createElement(RangeControl, {
							label: prm.label,
							value: props.attr[prm.key] / prm.coef,
							onChange: function onChange(val) {
								var data = {};data[prm.key] = val * prm.coef;props.set(data);
							},
							min: prm.min,
							max: prm.max
						}));
						break;
					case 'image':
						rtn.push(wp.element.createElement(SelectResponsiveImage, {
							set: props.set,
							attr: props.attr,
							keys: prm.keys,
							size: prm.size
						}));
						break;
				}
			} else if (_.isObject(prm.values)) {
				var subClasses = CP.getSubClasses(prm);
				var bindClasses = CP.getBindClasses(prm);

				var _options = void 0,
				    _values = void 0;
				if (Array.isArray(prm.values)) {
					_values = prm.values;
					_options = prm.values.map(function (cls) {
						return { label: cls, value: cls };
					});
				} else {
					_values = Object.keys(prm.values);
					_options = _values.map(function (cls) {
						return { label: prm.values[cls], value: cls };
					});
				}

				rtn.push(wp.element.createElement(SelectControl, {
					label: prm.label,
					onChange: function onChange(cls) {
						var prevCls = CP.getSelectiveClass(props, prm.values, prm.key);
						var sels = [];
						if (prevCls) {
							if (subClasses[prevCls]) {
								sels = sels.concat(subClasses[prevCls]);
							}
							if (bindClasses[prevCls]) {
								sels = sels.concat(bindClasses[prevCls]);
							}
							sels = _.difference(sels, subClasses[cls]);
						}
						sels = sels.concat(_values);

						CP.switchSelectiveClass(props, sels, bindClasses[cls].concat([cls]), prm.key);
					},
					value: CP.getSelectiveClass(props, prm.values, prm.key),
					options: _options
				}));

				if (prm.sub) {
					var currentClass = CP.getSelectiveClass(props, prm.values, prm.key);
					if (currentClass && prm.sub[currentClass]) {
						var sub = [];
						prm.sub[currentClass].map(function (prm) {
							sub.push(SelectClass(prm));
						});
						rtn.push(wp.element.createElement(
							'div',
							{ className: 'sub' },
							sub
						));
					}
				}
			} else {
				rtn.push(wp.element.createElement(CheckboxControl, {
					label: prm.label,
					onChange: function onChange() {
						CP.toggleClass(props, prm.values, prm.key);
					},
					checked: CP.hasClass(props, prm.values, prm.key)
				}));
				if (prm.sub) {
					if (CP.hasClass(props, prm.values, prm.key)) {
						var _sub2 = [];
						prm.sub.map(function (prm) {
							_sub2.push(SelectClass(prm));
						});
						rtn.push(wp.element.createElement(
							'div',
							{ className: 'sub' },
							_sub2
						));
					}
				}
			}
		}
		return rtn;
	};
	return wp.element.createElement(
		PanelBody,
		{ title: props.title, initialOpen: false, icon: props.icon },
		props.selectiveClasses.map(SelectClass)
	);
};

var AlignClassToolbar = function AlignClassToolbar(props) {
	var aligns = ['left', 'center', 'right'];
	return wp.element.createElement(BlockAlignmentToolbar, {
		value: CP.getSelectiveClass(props, aligns),
		onChange: function onChange(align) {
			CP.switchSelectiveClass(props, aligns, align, props.key);
		}
	});
};

var ImporterCSVPanel = function ImporterCSVPanel(props) {
	var reader = new FileReader();
	reader.onload = function (e) {
		props.callback(CP.parseCSV(e.target.result));
	};
	return wp.element.createElement(
		PanelBody,
		{ title: props.title, initialOpen: false, icon: props.icon },
		wp.element.createElement(FormFileUpload, {
			label: 'CSV',
			accept: 'text/csv',
			onChange: function onChange(e) {
				reader.readAsText(e.target.files[0]);
			}
		})
	);
};
