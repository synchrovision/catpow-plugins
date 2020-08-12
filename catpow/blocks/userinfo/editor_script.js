registerBlockType('catpow/userinfo', {
	title: '🐾 UserInfo',
	icon: 'admin-users',
	category: 'catpow',
	example: CP.example,
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    setAttributes = _ref.setAttributes,
		    className = _ref.className;

		return [wp.element.createElement(
			'div',
			{ 'class': 'embedded_content' },
			wp.element.createElement(
				'div',
				{ 'class': 'label' },
				'UserInfo'
			),
			wp.element.createElement(InnerBlocks, { template: [['core/paragraph', { content: '[output last_name] [output first_name]' }]] })
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement(InnerBlocks.Content, null);
	}
});
