registerBlockType('catpow/t-heading', {
	title: '🐾 T-Heading',
	icon: 'editor-code',
	category: 'catpow-mail',
	transforms: {
		from: [{
			type: 'block',
			blocks: ['core/paragraph'],
			transform: function transform(attributes) {
				return createBlock('catpow/t-heading', {
					classes: 'wp-block-catpow-t-heading header center medium',
					text: attributes.content
				});
			}
		}, {
			type: 'block',
			blocks: ['catpow/t-paragraph'],
			transform: function transform(attributes) {
				return createBlock('catpow/t-heading', {
					classes: 'wp-block-catpow-t-heading header center medium',
					title: attributes.text
				});
			}
		}]
	},
	attributes: {
		classes: { source: 'attribute', selector: 'table', attribute: 'class', default: 'wp-block-catpow-t-heading header medium center' },
		title: { source: 'children', selector: 'tbody td', default: 'Title' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    title = attributes.title;

		var primaryClass = 'wp-block-catpow-t-heading';
		var states = CP.wordsToFlags(classes);

		var selectiveClasses = ['color', { label: 'タイプ', values: ['header', 'headline', 'catch'] }, { label: 'サイズ', values: ['large', 'medium', 'small'] }];

		return [wp.element.createElement(
			'table',
			{ width: '100%', className: classes },
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
			BlockControls,
			null,
			wp.element.createElement(AlignClassToolbar, { set: setAttributes, attr: attributes })
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses,
				filters: CP.filters['t-heading'] || {}
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
		    title = attributes.title;

		var primaryClass = 'wp-block-catpow-t-heading';
		return wp.element.createElement(
			'table',
			{ width: '100%', className: classes },
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
