registerBlockType('catpow/maincolumn', {
	title: '🐾 MainColumn',
	icon: 'editor-code',
	category: 'catpow',
	attributes: {
		columnType: { type: 'string', default: 'main' }
	},
	parent: ['catpow/sidebar'],
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;

		return [wp.element.createElement(
			'div',
			{ className: 'column column_main' },
			wp.element.createElement(InnerBlocks, { template: [['catpow/section']], templateLock: false })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement(
			'div',
			{ className: 'column column_main' },
			wp.element.createElement(InnerBlocks.Content, null)
		);
	}
});
