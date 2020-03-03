registerBlockType('catpow/formbuttons', {
	title: '🐾 FormButtons',
	icon: 'upload',
	category: 'catpow',
	attributes: {
		version: { type: 'number', default: 0 },
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-formbuttons buttons' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				event: { source: 'attribute', attribute: 'data-event' },
				button: { source: 'text' }
			},
			default: [{ classes: 'item', button: '[button 送信 send]' }]
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var items = attributes.items,
		    classes = attributes.classes;

		var primaryClass = 'wp-block-catpow-formbuttons';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var selectiveClasses = [{
			label: 'タイプ',
			values: { buttons: 'ボタン' },
			sub: {
				buttons: [{ label: 'サイズ', values: { l: '大', m: '中', s: '小', ss: '極小' } }]
			},
			item: {
				buttons: ['color', { label: '属性', values: ['default', 'primary', 'negative', 'danger', 'secure'] }, { label: 'アイコン', 'values': ['play', 'next', 'back', 'file', 'home', 'trash', 'cart', 'mail', 'search', 'caution', 'help', 'open', 'close', 'plus', 'minus', 'refresh', 'edit', 'check'] }, 'event']
			}
		}];

		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var rtn = [];

		var parseButtonShortCode = function parseButtonShortCode(code) {
			var matches = code.match(/^\[button ([^ ]+) ([^ ]+)( ignore_message\=1)?\]$/);
			if (matches) {
				var _rtn = { content: matches[1], action: matches[2] };
				if (matches[3]) {
					_rtn.ignore_message = 1;
				}
				return _rtn;
			}
			return { content: '送信' };
		};
		var createButtonShortCode = function createButtonShortCode(prm) {
			var rtn = '[button ' + prm.content + ' ' + prm.action;
			if (prm.ignore_message) {
				rtn += ' ignore_message=1';
			}
			if (prm.evet) {
				rtn += ' event=' + prm.event;
			}
			rtn += ']';
			return rtn;
		};

		itemsCopy.map(function (item, index) {
			if (!item.controlClasses) {
				item.controlClasses = 'control';
			}
			var buttonParam = parseButtonShortCode(item.button);
			rtn.push(wp.element.createElement(
				Item,
				{
					tag: 'li',
					set: setAttributes,
					attr: attributes,
					items: itemsCopy,
					index: index,
					isSelected: isSelected
				},
				wp.element.createElement(
					'div',
					{ 'class': 'button' },
					wp.element.createElement(
						'span',
						{
							onInput: function onInput(e) {
								buttonParam.content = e.target.innerText;
								itemsCopy[index].button = createButtonShortCode(buttonParam);
							},
							onBlur: function onBlur(e) {
								setAttributes({ items: itemsCopy });
							},
							contentEditable: 'true'
						},
						buttonParam.content
					),
					wp.element.createElement(
						'span',
						{ 'class': 'action',
							onInput: function onInput(e) {
								buttonParam.action = e.target.innerText;
								itemsCopy[index].button = createButtonShortCode(buttonParam);
							},
							onBlur: function onBlur(e) {
								setAttributes({ items: itemsCopy });
							},
							contentEditable: 'true'
						},
						buttonParam.action
					)
				)
			));
		});

		if (attributes.EditMode === undefined) {
			attributes.EditMode = false;
		}

		return [wp.element.createElement(
			'ul',
			{ className: classes },
			rtn
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses
			}),
			wp.element.createElement(SelectItemClassPanel, {
				title: '\u30DC\u30BF\u30F3',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				triggerClasses: selectiveClasses[0]
			}),
			wp.element.createElement(
				PanelBody,
				{ title: 'CLASS', icon: 'admin-generic', initialOpen: false },
				wp.element.createElement(TextareaControl, {
					label: '\u30AF\u30E9\u30B9',
					onChange: function onChange(clss) {
						return setAttributes({ classes: clss });
					},
					value: classArray.join(' ')
				})
			),
			wp.element.createElement(ItemControlInfoPanel, null)
		), wp.element.createElement(
			BlockControls,
			null,
			wp.element.createElement(AlignClassToolbar, { set: setAttributes, attr: attributes })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className;
		var items = attributes.items,
		    classes = attributes.classes;

		var classArray = _.uniq(attributes.classes.split(' '));

		var rtn = [];
		items.map(function (item, index) {
			rtn.push(wp.element.createElement(
				'li',
				{ className: item.classes, 'data-event': item.event },
				item.button
			));
		});
		return wp.element.createElement(
			'ul',
			{ className: classes },
			rtn
		);
	}
});
