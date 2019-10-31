registerBlockType('catpow/form', {
	title: '🐾 Form',
	icon: 'editor-code',
	category: 'catpow',
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    setAttributes = _ref.setAttributes,
		    className = _ref.className;
		var content_path = attributes.content_path,
		    post_data_path = attributes.post_data_path,
		    inputs = attributes.inputs;


		var postDataSelection = false;

		Object.keys(cpEmbeddablesTree.form).forEach(function (parentKey) {
			cpEmbeddablesTree.form[parentKey].children.map(function (item) {
				if (item.id === content_path && item.post_data_paths) {
					postDataSelection = [];
					Object.keys(item.post_data_paths).forEach(function (key) {
						postDataSelection.push({ id: key, name: item.post_data_paths[key] });
					});
				}
			});
		});
		if (postDataSelection === false) {
			if (post_data_path) {
				setAttributes({ post_data_path: false });
			}
		} else {
			if (!post_data_path || !postDataSelection[post_data_path]) {
				setAttributes({ post_data_path: postDataSelection[0]['id'] });
			}
		}

		return [wp.element.createElement(
			'div',
			{ 'class': 'embedded_content' },
			wp.element.createElement(
				'div',
				{ 'class': 'label' },
				content_path
			),
			wp.element.createElement(ServerSideRender, { block: 'catpow/form', attributes: attributes })
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: 'Path' },
				wp.element.createElement(TreeSelect, {
					label: 'path',
					selectedId: content_path,
					tree: cpEmbeddablesTree.form,
					onChange: function onChange(content_path) {
						setAttributes({ content_path: content_path });
					}
				}),
				postDataSelection && wp.element.createElement(TreeSelect, {
					label: 'form',
					selectedId: post_data_path,
					tree: postDataSelection,
					onChange: function onChange(post_data_path) {
						setAttributes({ post_data_path: post_data_path });
					}
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: '\u521D\u671F\u5165\u529B\u5024' },
				wp.element.createElement(TextareaControl, {
					label: 'inputs',
					value: inputs,
					onChange: function onChange(inputs) {
						setAttributes({ inputs: inputs });
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
