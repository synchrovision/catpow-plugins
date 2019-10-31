registerBlockType('catpow/simpletable', {
	title: '🐾 SimpleTable',
	icon: 'editor-table',
	category: 'catpow',

	attributes: {
		classes: { source: 'attribute', selector: 'table', attribute: 'class', default: 'wp-block-catpow-simpletable spec' },
		items: {
			source: 'query',
			selector: 'table tr',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				cond: { source: 'attribute', attribute: 'data-refine-cond' },
				th: { source: 'children', selector: 'th' },
				td: { source: 'children', selector: 'td' }
			},
			default: [{ th: ['Title'], td: ['Content'] }, { th: ['Title'], td: ['Content'] }, { th: ['Title'], td: ['Content'] }]
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    items = attributes.items;


		var selectiveClasses = [{
			label: 'タイプ',
			values: ['spec', 'info', 'history', 'inputs'],
			item: {
				spec: [{ label: '種別', values: {
						normal: 'なし',
						important: '重要',
						caution: '注意'
					} }],
				inputs: [{ label: '種別', values: {
						normal: 'なし',
						required: '必須',
						optional: '任意',
						readonly: '固定'
					} }, 'cond']
			}
		}];

		var rtn = [];
		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		itemsCopy.map(function (item, index) {
			rtn.push(wp.element.createElement(
				Item,
				{ tag: 'tr', set: setAttributes, items: itemsCopy, index: index },
				wp.element.createElement(
					'th',
					null,
					wp.element.createElement(RichText, {
						onChange: function onChange(th) {
							itemsCopy[index].th = th;setAttributes({ items: itemsCopy });
						},
						value: item.th
					})
				),
				wp.element.createElement(
					'td',
					null,
					wp.element.createElement(RichText, {
						onChange: function onChange(td) {
							itemsCopy[index].td = td;setAttributes({ items: itemsCopy });
						},
						value: item.td
					}),
					wp.element.createElement(ItemControl, {
						tag: 'tr',
						set: setAttributes,
						attr: attributes,
						items: itemsCopy,
						index: index,
						triggerClasses: selectiveClasses[0]
					})
				)
			));
		});
		return [wp.element.createElement(
			'table',
			{ className: classes },
			wp.element.createElement(
				'tbody',
				null,
				rtn
			)
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
			wp.element.createElement(ItemControlInfoPanel, null)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className;
		var classes = attributes.classes,
		    items = attributes.items;

		var rtn = [];
		items.map(function (item, index) {
			rtn.push(wp.element.createElement(
				'tr',
				{ className: item.classes, 'data-refine-cond': item.cond },
				wp.element.createElement(
					'th',
					null,
					item.th
				),
				wp.element.createElement(
					'td',
					null,
					item.td
				)
			));
		});
		return wp.element.createElement(
			'table',
			{ className: classes },
			wp.element.createElement(
				'tbody',
				null,
				rtn
			)
		);
	}
});
