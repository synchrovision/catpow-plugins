registerBlockType('catpow/t-header', {
	title: '🐾 T-Header',
	icon: 'editor-code',
	category: 'catpow-mail',
	attributes: {
		classes: { source: 'attribute', selector: 'table', attribute: 'class', default: 'wp-block-catpow-t-header' },
		height: { source: 'attribute', selector: 'table', attribute: 'height', default: '100' },
		title: { source: 'children', selector: 'td', default: 'Title' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    height = attributes.height,
		    title = attributes.title;

		var primaryClass = 'wp-block-catpow-t-header';
		var states = CP.wordsToFlags(classes);

		var selectiveClasses = ['color', { input: 'range', label: '高さ', key: 'height', min: 20, max: 200, step: 5 }];

		return [wp.element.createElement(
			'table',
			{ width: '100%', height: height, className: classes },
			wp.element.createElement(
				'tbody',
				null,
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'td',
						null,
						wp.element.createElement(RichText, {
							onChange: function onChange(title) {
								setAttributes({ title: title });
							},
							value: title
						})
					)
				)
			)
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses,
				filters: CP.filters['t-header'] || {}
			}),
			wp.element.createElement(
				PanelBody,
				{ title: 'CLASS', icon: 'admin-generic', initialOpen: false },
				wp.element.createElement(TextareaControl, {
					label: '\u30AF\u30E9\u30B9',
					onChange: function onChange(classes) {
						return setAttributes({ classes: classes });
					},
					value: classes
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes,
		    height = attributes.height,
		    title = attributes.title;

		var primaryClass = 'wp-block-catpow-t-header';
		return wp.element.createElement(
			'table',
			{ width: '100%', height: height, className: classes },
			wp.element.createElement(
				'tbody',
				null,
				wp.element.createElement(
					'tr',
					null,
					wp.element.createElement(
						'td',
						null,
						title
					)
				)
			)
		);
	}
});
