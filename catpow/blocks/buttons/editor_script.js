registerBlockType('catpow/buttons', {
	title: '🐾 Buttons',
	icon: wp.element.createElement(
		'svg',
		{ role: 'img', focusable: 'false', xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 20 20', 'aria-hidden': 'true' },
		wp.element.createElement('path', { d: 'M19.5,11c0,2.8-2.2,5-5,5h-9c-2.8,0-5-2.2-5-5V9c0-2.8,2.2-5,5-5h9c2.8,0,5,2.2,5,5V11z M5.5,5c-2.2,0-4,1.8-4,4 c0,2.2,1.8,4,4,4h9c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4H5.5z' })
	),
	category: 'catpow',
	attributes: {
		version: { type: 'number', default: 0 },
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-buttons buttons' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				event: { source: 'attribute', selector: '.button', attribute: 'data-event' },
				text: { source: 'text', selector: '.button' },
				url: { source: 'attribute', selector: '.button', attribute: 'href' }
			},
			default: [{ classes: 'item mail primary', event: '', text: 'お問合せ', url: '[home_url]/contact' }]
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes,
		    isSelected = _ref.isSelected;
		var items = attributes.items,
		    classes = attributes.classes;

		var primaryClass = 'wp-block-catpow-buttons';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var selectiveClasses = [{ label: 'サイズ', values: { l: '大', m: '中', s: '小', ss: '極小' } }, { label: 'インライン', values: 'i' }];
		var itemClasses = ['color', { label: '属性', values: ['default', 'primary', 'negative', 'danger', 'secure'] }, { label: 'アイコン', 'values': ['play', 'next', 'back', 'file', 'home', 'trash', 'cart', 'mail', 'search', 'caution', 'help', 'open', 'close', 'plus', 'minus', 'refresh', 'edit', 'check'] }, 'event'];

		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var rtn = [];

		itemsCopy.map(function (item, index) {
			rtn.push(wp.element.createElement(
				Item,
				{
					tag: 'li',
					set: setAttributes,
					attr: attributes,
					items: itemsCopy,
					index: index
				},
				wp.element.createElement(
					'div',
					{ 'class': 'button' },
					wp.element.createElement(
						'span',
						{
							onInput: function onInput(e) {
								itemsCopy[index].text = e.target.innerText;
							},
							onBlur: function onBlur(e) {
								setAttributes({ items: itemsCopy });
							},
							contentEditable: 'true'
						},
						item.text
					),
					isSelected && wp.element.createElement(
						'span',
						{ 'class': 'url',
							onInput: function onInput(e) {
								itemsCopy[index].url = e.target.innerText;
							},
							onBlur: function onBlur(e) {
								setAttributes({ items: itemsCopy });
							},
							contentEditable: 'true'
						},
						item.url
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
				itemClasses: itemClasses
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
				{ className: item.classes },
				wp.element.createElement(
					'a',
					{ href: item.url, className: 'button', 'data-event': item.event },
					item.text
				)
			));
		});
		return wp.element.createElement(
			'ul',
			{ className: classes },
			rtn
		);
	}
});
