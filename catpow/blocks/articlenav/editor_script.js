registerBlockType('catpow/articlenav', {
	title: '🐾 ArticelNav',
	icon: 'editor-ul',
	category: 'catpow',
	parent: ['catpow/sidecolumn'],
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;

		return [wp.element.createElement(
			'div',
			{ className: className },
			wp.element.createElement(
				'ul',
				{ 'class': 'article_nav' },
				wp.element.createElement(
					'li',
					null,
					wp.element.createElement(
						'h3',
						null,
						'[ArticleNav]'
					)
				)
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;

		return wp.element.createElement('div', { className: className });
	}
});
