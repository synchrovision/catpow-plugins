registerBlockType('catpow/loopblock', {
	title: '🐾 Loopblock',
	icon: 'editor-code',
	category: 'catpow-functional',
	example: CP.example,
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    setAttributes = _ref.setAttributes,
		    className = _ref.className;
		var content_path = attributes.content_path,
		    query = attributes.query;


		return [wp.element.createElement(
			'div',
			{ 'class': 'embedded_content' },
			wp.element.createElement(
				'div',
				{ 'class': 'label' },
				content_path
			),
			wp.element.createElement(InnerBlocks, null)
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: 'Query' },
				wp.element.createElement(TextControl, {
					label: 'content path',
					value: content_path,
					onChange: function onChange(query) {
						setAttributes({ content_path: content_path });
					}
				}),
				wp.element.createElement(TextareaControl, {
					label: 'query',
					value: query,
					onChange: function onChange(query) {
						setAttributes({ query: query });
					}
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement(InnerBlocks.Content, null);
	}
});
