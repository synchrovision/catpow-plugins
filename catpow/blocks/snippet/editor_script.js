registerBlockType('catpow/snippet', {
	title: '🐾 Snippet',
	icon: 'editor-code',
	category: 'catpow',
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
			wp.element.createElement(ServerSideRender, { block: 'catpow/snippet', attributes: attributes })
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: 'Path' },
				wp.element.createElement(TreeSelect, {
					label: 'path',
					selectedId: content_path,
					tree: cpEmbeddablesTree.snippet,
					onChange: function onChange(content_path) {
						setAttributes({ content_path: content_path });
					}
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return 'null';
	}
});
