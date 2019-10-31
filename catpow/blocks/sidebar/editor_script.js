registerBlockType('catpow/sidebar', {
	title: '🐾 Sidebar',
	icon: 'editor-code',
	category: 'catpow',
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-sidebar left' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes;

		var primaryClass = 'wp-block-catpow-sidebar';
		var classArray = _.uniq((className + ' ' + classes).split(' '));

		return [wp.element.createElement(
			'div',
			{ className: classes },
			wp.element.createElement(InnerBlocks, {
				template: [['catpow/maincolumn'], ['catpow/sidecolumn']],
				templateLock: 'all'
			})
		), wp.element.createElement(
			BlockControls,
			null,
			wp.element.createElement(AlignClassToolbar, { set: setAttributes, attr: attributes })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes;

		return wp.element.createElement(
			'div',
			{ className: classes },
			wp.element.createElement(InnerBlocks.Content, null)
		);
	}
});
