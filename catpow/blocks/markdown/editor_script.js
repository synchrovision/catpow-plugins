registerBlockType('catpow/markdown', {
	title: '🐾 Markdown',
	icon: 'editor-code',
	category: 'catpow',
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    setAttributes = _ref.setAttributes,
		    className = _ref.className,
		    isSelected = _ref.isSelected;
		var classes = attributes.classes,
		    code = attributes.code;


		var selectiveClasses = [{ label: 'タイプ', values: ['document', 'article', 'board'] }];

		return wp.element.createElement(
			'div',
			{ className: classes },
			isSelected && wp.element.createElement(
				'div',
				{ className: 'editor' },
				wp.element.createElement(TextareaControl, {
					value: code,
					rows: 15,
					onChange: function onChange(code) {
						setAttributes({ code: code });
					}
				})
			),
			wp.element.createElement(ServerSideRender, { block: 'catpow/markdown', attributes: attributes }),
			wp.element.createElement(
				InspectorControls,
				null,
				wp.element.createElement(SelectClassPanel, {
					title: '\u30AF\u30E9\u30B9',
					icon: 'art',
					set: setAttributes,
					attr: attributes,
					selectiveClasses: selectiveClasses
				})
			)
		);
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes;

		return wp.element.createElement('div', { className: classes });
	}
});
