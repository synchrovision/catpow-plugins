registerBlockType('catpow/section', {
	title: '🐾 Section',
	description: '見出しと本文のセット',
	icon: 'id-alt',
	category: 'catpow',
	attributes: {
		id: { source: 'attribute', selector: 'section', attribute: 'id' },
		classes: { source: 'attribute', selector: 'section', attribute: 'class', default: 'wp-block-catpow-section article level3 center catch' },
		icon: { source: 'attribute', selector: 'section', attribute: 'data-icon' },

		prefix: { source: 'children', selector: 'header div.prefix' },
		title: { type: 'array', source: 'children', selector: 'header h2,header .heading', default: ['Title'] },
		read: { type: 'array', source: 'children', selector: 'header p' },

		headerImageMime: { source: 'attribute', selector: 'header .image [src]', attribute: 'data-mime' },
		headerImageSrc: { source: 'attribute', selector: 'header .image [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		headerImageSrcset: { source: 'attribute', selector: 'header .image [src]', attribute: 'srcset' },
		headerImageAlt: { source: 'attribute', selector: 'header .image [src]', attribute: 'alt' },

		headerBackgroundImageMime: { source: 'attribute', selector: 'header .background [src]', attribute: 'data-mime' },
		headerBackgroundImageSrc: { source: 'attribute', selector: 'header .background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		headerBackgroundImageSrcset: { source: 'attribute', selector: 'header .background [src]', attribute: 'srcset' },
		headerBackgroundImageAlt: { source: 'attribute', selector: 'header .background [src]', attribute: 'alt' },

		imageMime: { source: 'attribute', selector: '.image [src]', attribute: 'data-mime' },
		imageSrc: { source: 'attribute', selector: '.image [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		imageSrcset: { source: 'attribute', selector: '.image [src]', attribute: 'srcset' },
		imageAlt: { source: 'attribute', selector: '.image [src]', attribute: 'alt' },

		backgroundImageSrc: { source: 'attribute', selector: '.wp-block-catpow-section>.background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		backgroundImageSrcset: { source: 'attribute', selector: '.wp-block-catpow-section>.background [src]', attribute: 'srcset' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var id = attributes.id,
		    classes = attributes.classes,
		    prefix = attributes.prefix,
		    title = attributes.title,
		    headerImageMime = attributes.headerImageMime,
		    headerImageSrc = attributes.headerImageSrc,
		    headerImageSrcset = attributes.headerImageSrcset,
		    headerImageAlt = attributes.headerImageAlt,
		    read = attributes.read,
		    imageMime = attributes.imageMime,
		    imageSrc = attributes.imageSrc,
		    imageSrcset = attributes.imageSrcset,
		    imageAlt = attributes.imageAlt,
		    backgroundImageSrc = attributes.backgroundImageSrc;

		var primaryClass = 'wp-block-catpow-section';
		var classArray = _.uniq((className + ' ' + classes).split(' '));

		var states = CP.wordsToFlags(classes);

		var imageKeys = {
			icon: { src: "icon" },
			image: { mime: "imageMime", src: "imageSrc", alt: "imageAlt", srcset: "imageSrcset" },
			headerImage: { mime: "headerImageMime", src: "headerImageSrc", alt: "headerImageAlt", srcset: "headerImageSrcset" },
			headerBackgroundImage: { mime: "headerBackgroundImageMime", src: "headerBackgroundImageSrc", alt: "headerBackgroundImageAlt", srcset: "headerBackgroundImageSrcset" },
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};
		var imageSizes = {
			image: 'medium',
			headerImage: 'medium_large'
		};

		var selectiveClasses = [{
			label: 'タイプ',
			filter: 'type',
			values: ['scene', 'article', 'column'],
			sub: {
				scene: ['color', 'pattern', { label: 'プレフィクス', values: 'hasPrefix' }, { label: 'ヘッダ画像', values: 'hasHeaderImage', sub: [{ input: 'image', keys: imageKeys.headerImage, size: imageSizes.headerImage }] }, { label: 'ヘッダ背景画像', values: 'hasHeaderBackgroundImage', sub: [{ input: 'image', keys: imageKeys.headerBackgroundImage }, { label: '薄く', values: 'paleHeaderBG' }] }, { label: '抜き色文字', values: 'inverseText', sub: [{ label: 'ヘッダ背景色', values: 'hasHeaderBackgroundColor' }] }, { label: 'リード', values: 'hasRead' }, { label: '背景画像', values: 'hasBackgroundImage', sub: [{ input: 'image', keys: imageKeys.backgroundImage }, { label: '薄く', values: 'paleBG' }] }, { label: '背景色', values: 'hasBackgroundColor' }, { label: 'メニューアイコン', values: 'hasNavIcon', sub: [{ input: 'image', label: 'アイコン', keys: imageKeys.icon, size: 'thumbnail' }] }],
				article: ['color', { label: 'レベル', values: { level2: '2', level3: '3', level4: '4' } }, { label: '見出しタイプ', values: { header: 'ヘッダ', headline: 'ヘッドライン', catch: 'キャッチ' } }, { label: 'ヘッダ画像', values: 'hasHeaderImage', sub: [{ input: 'image', keys: imageKeys.headerImage, size: imageSizes.headerImage }] }, { label: 'リード', values: 'hasRead' }, { label: '背景画像', values: 'hasBackgroundImage', sub: [{ input: 'image', keys: imageKeys.backgroundImage }, { label: '薄く', values: 'paleBG' }] }, { label: '背景色', values: 'hasBackgroundColor' }, { label: 'メニューアイコン', values: 'hasNavIcon', sub: [{ input: 'image', label: 'アイコン', keys: imageKeys.icon, size: 'thumbnail' }] }],
				column: ['color', 'pattern', { label: 'アイコン', values: 'hasIcon', sub: [{ label: '種類', values: ['check', 'help', 'alert', 'caution', 'warn'] }] }, { label: '画像', values: 'hasImage', sub: [{ input: 'image', keys: imageKeys.image }] }, { label: '背景画像', values: 'hasBackgroundImage', sub: [{ input: 'image', keys: imageKeys.backgroundImage }, { label: '薄く', values: 'paleBG' }] }, { label: '線', values: { no_border: 'なし', thin_border: '細', bold_border: '太' } }, { label: '角丸', values: 'round' }, { label: '影', values: 'shadow', sub: [{ label: '内側', values: 'inset' }] }, { label: 'メニューアイコン', values: 'hasNavIcon', sub: [{ input: 'image', label: 'アイコン', keys: imageKeys.icon, size: 'thumbnail' }] }]
			},
			bind: {
				scene: ['level1'],
				column: ['level3']
			}
		}];

		var level = CP.getNumberClass({ attr: attributes }, 'level');

		return [wp.element.createElement(
			BlockControls,
			null,
			wp.element.createElement(AlignClassToolbar, { set: setAttributes, attr: attributes })
		), wp.element.createElement(
			'section',
			{ id: id, className: classArray.join(' ') },
			states.hasImage && wp.element.createElement(
				'div',
				{ 'class': 'image' },
				wp.element.createElement(SelectResponsiveImage, {
					attr: attributes,
					set: setAttributes,
					keys: imageKeys.image,
					size: imageSizes.image
				})
			),
			wp.element.createElement(
				'div',
				{ 'class': 'contents' },
				wp.element.createElement(
					'header',
					null,
					wp.element.createElement(
						'div',
						{ 'class': 'title' },
						states.hasPrefix && wp.element.createElement(
							'div',
							{ 'class': 'prefix' },
							wp.element.createElement(RichText, { tagName: 'div', value: prefix, onChange: function onChange(prefix) {
									return setAttributes({ prefix: prefix });
								} })
						),
						states.hasHeaderImage && wp.element.createElement(
							'div',
							{ 'class': 'image' },
							wp.element.createElement(SelectResponsiveImage, {
								set: setAttributes,
								attr: attributes,
								keys: imageKeys.headerImage,
								size: imageSizes.headerImage
							})
						),
						el('h' + level, { className: 'heading' }, wp.element.createElement(RichText, { tagName: 'div', value: title, onChange: function onChange(title) {
								return setAttributes({ title: title });
							} })),
						states.hasRead && wp.element.createElement(
							'p',
							null,
							wp.element.createElement(RichText, { tagName: 'div', value: read, onChange: function onChange(read) {
									return setAttributes({ read: read });
								} })
						)
					),
					states.hasHeaderBackgroundImage && wp.element.createElement(
						'div',
						{ 'class': 'background' },
						wp.element.createElement(SelectResponsiveImage, {
							set: setAttributes,
							attr: attributes,
							keys: imageKeys.headerBackgroundImage
						})
					)
				),
				wp.element.createElement(
					'div',
					{ 'class': 'text' },
					wp.element.createElement(InnerBlocks, null)
				)
			),
			states.hasBackgroundImage && wp.element.createElement(
				'div',
				{ 'class': 'background' },
				wp.element.createElement(SelectResponsiveImage, {
					set: setAttributes,
					attr: attributes,
					keys: imageKeys.backgroundImage
				})
			)
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses,
				filters: CP.filters.section || {}
			}),
			wp.element.createElement(
				PanelBody,
				{ title: 'ID', icon: 'admin-links', initialOpen: false },
				wp.element.createElement(TextControl, {
					label: 'ID',
					onChange: function onChange(id) {
						setAttributes({ id: id });
					},
					value: id
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: 'CLASS', icon: 'admin-generic', initialOpen: false },
				wp.element.createElement(TextareaControl, {
					label: '\u30AF\u30E9\u30B9',
					onChange: function onChange(clss) {
						return setAttributes({ classes: clss });
					},
					value: classArray.join(' ')
				})
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var id = attributes.id,
		    icon = attributes.icon,
		    classes = attributes.classes,
		    prefix = attributes.prefix,
		    title = attributes.title,
		    headerImageSrc = attributes.headerImageSrc,
		    headerImageSrcset = attributes.headerImageSrcset,
		    headerImageAlt = attributes.headerImageAlt,
		    read = attributes.read,
		    imageSrc = attributes.imageSrc,
		    imageSrcset = attributes.imageSrcset,
		    imageAlt = attributes.imageAlt,
		    backgroundImageSrc = attributes.backgroundImageSrc;


		var states = CP.wordsToFlags(classes);
		var level = CP.getNumberClass({ attr: attributes }, 'level');

		var imageKeys = {
			icon: { src: "icon" },
			image: { mime: "imageMime", src: "imageSrc", alt: "imageAlt", srcset: "imageSrcset" },
			headerImage: { mime: "headerImageMime", src: "headerImageSrc", alt: "headerImageAlt", srcset: "headerImageSrcset" },
			headerBackgroundImage: { mime: "headerBackgroundImageMime", src: "headerBackgroundImageSrc", alt: "headerBackgroundImageAlt", srcset: "headerBackgroundImageSrcset" },
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};

		return wp.element.createElement(
			'section',
			{ id: id, className: classes, 'data-icon': icon },
			states.hasImage && wp.element.createElement(
				'div',
				{ 'class': 'image' },
				wp.element.createElement(ResponsiveImage, {
					attr: attributes,
					keys: imageKeys.image,
					size: 'medium_large'
				})
			),
			wp.element.createElement(
				'div',
				{ 'class': 'contents' },
				wp.element.createElement(
					'header',
					null,
					wp.element.createElement(
						'div',
						{ 'class': 'title' },
						states.hasPrefix && wp.element.createElement(
							'div',
							{ 'class': 'prefix' },
							prefix
						),
						states.hasHeaderImage && wp.element.createElement(
							'div',
							{ 'class': 'image' },
							wp.element.createElement(ResponsiveImage, {
								attr: attributes,
								keys: imageKeys.headerImage
							})
						),
						el('h' + level, { className: 'heading' }, title),
						states.hasRead && wp.element.createElement(
							'p',
							null,
							read
						)
					),
					states.hasHeaderBackgroundImage && wp.element.createElement(
						'div',
						{ 'class': 'background' },
						wp.element.createElement(ResponsiveImage, {
							attr: attributes,
							keys: imageKeys.headerBackgroundImage
						})
					)
				),
				wp.element.createElement(
					'div',
					{ 'class': 'text' },
					wp.element.createElement(InnerBlocks.Content, null)
				)
			),
			states.hasBackgroundImage && wp.element.createElement(
				'div',
				{ 'class': 'background' },
				wp.element.createElement(ResponsiveImage, {
					attr: attributes,
					keys: imageKeys.backgroundImage
				})
			)
		);
	}
});
