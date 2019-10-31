registerBlockType('catpow/format', {
	title: '🐾 Format',
	icon: 'editor-code',
	category: 'catpow',
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-format' },
		content_path: { source: 'string' },
		content: { source: 'children', selector: 'div' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    content_path = attributes.content_path,
		    content = attributes.content;

		var primaryClass = 'wp-block-catpow-format';

		return [wp.element.createElement(RichText, {
			onChange: function onChange(content) {
				setAttributes({ content: content });
			},
			value: content
		}), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: 'Path' },
				wp.element.createElement(TreeSelect, {
					label: 'path',
					selectedId: content_path,
					tree: cpEmbeddablesTree.format,
					onChange: function onChange(content_path) {
						setAttributes({
							content_path: content_path,
							content: content_path
						});
					}
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes,
		    content = attributes.content;

		console.log(content);
		return wp.element.createElement(
			'div',
			{ className: classes },
			content
		);
	}
});
