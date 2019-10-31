registerBlockType('catpow/sidecolumn', {
	title: '🐾 SideColumn',
	icon: 'editor-code',
	category: 'catpow',
	parent: ['catpow/sidebar'],
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;

		return [wp.element.createElement(
			'div',
			{ className: 'column column_side' },
			wp.element.createElement(
				'div',
				{ 'class': 'column_side_container' },
				wp.element.createElement(InnerBlocks, { template: [['catpow/articlenav']], templateLock: false })
			),
			wp.element.createElement('div', { 'class': 'sidebar_button' })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement(
			'div',
			{ className: 'column column_side' },
			wp.element.createElement(
				'div',
				{ 'class': 'column_side_container' },
				wp.element.createElement(InnerBlocks.Content, null)
			),
			wp.element.createElement('div', { 'class': 'sidebar_button' })
		);
	},

	deprecated: [{
		save: function save(_ref3) {
			var attributes = _ref3.attributes,
			    className = _ref3.className,
			    setAttributes = _ref3.setAttributes;

			return wp.element.createElement(
				'div',
				{ className: 'column column_side' },
				wp.element.createElement(InnerBlocks.Content, null),
				wp.element.createElement('div', { 'class': 'sidebar_button' })
			);
		}
	}]
});
