/*
* 現在の投稿を規定のテンプレートを用いて表示する
* APIを用いて様々な操作を行うcomponentを表示する
*/
registerBlockType('catpow/tool', {
	title: '🐾 Tool',
	icon: 'editor-code',
	category: 'catpow-embed',
	example: CP.example,
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    setAttributes = _ref.setAttributes,
		    className = _ref.className;
		var content_path = attributes.content_path,
		    query = attributes.query;


		if (attributes.postID === undefined) {
			setAttributes({ postID: wp.data.select("core/editor").getCurrentPostId() });
		}

		return [wp.element.createElement(
			'div',
			{ 'class': 'embedded_content' },
			wp.element.createElement(
				'div',
				{ 'class': 'label' },
				content_path
			),
			wp.element.createElement(ServerSideRender, { block: 'catpow/tool', attributes: attributes })
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: 'Path' },
				wp.element.createElement(TreeSelect, {
					label: 'path',
					selectedId: content_path,
					tree: cpEmbeddablesTree.tool,
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
