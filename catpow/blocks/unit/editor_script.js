registerBlockType('catpow/unit', {
	title: '🐾 Unit',
	icon: 'id',
	category: 'catpow',
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-unit left mediumImage' },
		mime: { source: 'attribute', selector: 'figure img', attribute: 'data-mime' },
		src: { source: 'attribute', selector: 'figure img', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		srcset: { source: 'attribute', selector: 'figure img', attribute: 'srcset' },
		alt: { source: 'attribute', selector: 'figure img', attribute: 'alt', default: '' },
		caption: { source: 'text', selector: 'figure figcaption', attribute: 'alt', default: '' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    src = attributes.src,
		    alt = attributes.alt,
		    caption = attributes.caption;

		var primaryClass = 'wp-block-catpow-unit';

		var imageKeys = {
			image: { mime: "mime", src: "src", alt: "alt", srcset: "srcset" }
		};
		var imageSizes = {
			image: 'medium_large'
		};
		var selectiveClasses = [{ label: '画像位置', values: { left: '左', right: '右' } }, { label: '画像サイズ', values: { largeImage: '大', mediumImage: '中', smallImage: '小' } }];

		return [wp.element.createElement(
			'div',
			{ className: classes },
			wp.element.createElement(
				'figure',
				{ className: 'image' },
				wp.element.createElement(SelectResponsiveImage, {
					attr: attributes,
					set: setAttributes,
					keys: imageKeys.image,
					size: imageSizes.image
				}),
				wp.element.createElement(
					'figcaption',
					null,
					wp.element.createElement(TextControl, { onChange: function onChange(caption) {
							return setAttributes({ caption: caption });
						}, value: caption })
				)
			),
			wp.element.createElement(
				'div',
				{ className: 'content' },
				wp.element.createElement(InnerBlocks, null)
			)
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses
			}),
			wp.element.createElement(
				PanelBody,
				{ title: 'CLASS', icon: 'admin-generic', initialOpen: false },
				wp.element.createElement(TextareaControl, {
					label: '\u30AF\u30E9\u30B9',
					onChange: function onChange(classes) {
						return setAttributes({ classes: classes });
					},
					value: classes
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes,
		    src = attributes.src,
		    alt = attributes.alt,
		    caption = attributes.caption;

		var imageKeys = {
			image: { mime: "mime", src: "src", alt: "alt", srcset: "srcset" }
		};
		return wp.element.createElement(
			'div',
			{ className: classes },
			wp.element.createElement(
				'figure',
				{ className: 'image' },
				wp.element.createElement(ResponsiveImage, {
					attr: attributes,
					keys: imageKeys.image
				}),
				caption && wp.element.createElement(
					'figcaption',
					null,
					caption
				)
			),
			wp.element.createElement(
				'div',
				{ className: 'content' },
				wp.element.createElement(InnerBlocks.Content, null)
			)
		);
	},


	deprecated: [{
		attributes: {
			classes: { source: 'attribute', selector: 'div', attribute: 'class', default: '' },
			src: { source: 'attribute', selector: 'figure img', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
			alt: { source: 'attribute', selector: 'figure img', attribute: 'alt', default: '' },
			caption: { source: 'text', selector: 'figure figcaption', attribute: 'alt', default: '' }
		},
		save: function save(_ref3) {
			var attributes = _ref3.attributes,
			    className = _ref3.className,
			    setAttributes = _ref3.setAttributes;
			var classes = attributes.classes,
			    src = attributes.src,
			    alt = attributes.alt,
			    caption = attributes.caption;

			return wp.element.createElement(
				'div',
				{ className: classes },
				wp.element.createElement(
					'figure',
					{ className: 'image' },
					wp.element.createElement('img', { src: src, alt: alt }),
					caption && wp.element.createElement(
						'figcaption',
						null,
						caption
					)
				),
				wp.element.createElement(
					'div',
					{ className: 'content' },
					wp.element.createElement(InnerBlocks.Content, null)
				)
			);
		}
	}]
});
