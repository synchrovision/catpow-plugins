registerBlockType('catpow/stickycontent', {
	title: '🐾 StickyContent',
	icon: 'editor-code',
	category: 'catpow',
	parent: ['catpow/sticky'],
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;

		return [wp.element.createElement(
			'div',
			{ className: 'sticky_content' },
			wp.element.createElement(InnerBlocks, { template: [['core/paragraph']], templateLock: false })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement(
			'div',
			{ className: 'sticky_content' },
			wp.element.createElement(InnerBlocks.Content, null)
		);
	}
});
