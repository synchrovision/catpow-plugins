registerBlockType('catpow/div', {
	title: '🐾 Div',
	icon: 'editor-code',
	category: 'catpow',
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-div frame thin_border' },

		backgroundImageSrc: { source: 'attribute', selector: '.wp-block-catpow-div>.background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		backgroundImageSrcset: { source: 'attribute', selector: '.wp-block-catpow-div>.background [src]', attribute: 'srcset' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes;

		var primaryClass = 'wp-block-catpow-div';
		var classArray = _.uniq((className + ' ' + classes).split(' '));

		var states = {
			hasBackgroundImage: false
		};

		var imageKeys = {
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};

		var selectiveClasses = [{
			label: 'タイプ',
			values: ['block', 'frame', 'columns'],
			sub: {
				frame: [{ label: '色', values: 'has_color', sub: ['color'] }, { label: 'パターン', values: 'has_pattern', sub: ['pattern'] }, { label: 'アイコン', values: 'has_icon', sub: [{
						label: 'タイプ',
						values: {
							check: 'チェック',
							point: 'ポイント',
							info: '情報',
							help: 'ヘルプ',
							alert: '注意',
							warn: '警告',
							search: '検索',
							phone: '電話',
							email: 'メール',
							price: '価格',
							review: 'レビュー',
							favor: 'お気に入り'
						}
					}] }, { label: '線', values: { no_border: 'なし', thin_border: '細', bold_border: '太' } }, { label: '角丸', values: 'round' }, { label: '影', values: 'shadow', sub: [{ label: '内側', values: 'inset' }] }],
				columns: [{ label: 'サイズ', values: { regular: '通常', wide: 'ワイド' } }]
			}
		}, { label: '背景画像', values: 'hasBackgroundImage', sub: [{ input: 'image', keys: imageKeys.backgroundImage }] }, { label: '余白', 'values': { noPad: 'なし', thinPad: '極細', lightPad: '細', mediumPad: '中', boldPad: '太', heavyPad: '極太' } }];

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		return [wp.element.createElement(
			'div',
			{ className: classes },
			states.hasBackgroundImage && wp.element.createElement(
				'div',
				{ 'class': 'background' },
				wp.element.createElement(ResponsiveImage, {
					set: setAttributes,
					attr: attributes,
					keys: imageKeys.backgroundImage
				})
			),
			wp.element.createElement(InnerBlocks, null)
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
		var classes = attributes.classes;


		var classArray = classes.split(' ');
		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		var hasBackgroundImage = hasClass('hasBackgroundImage');

		var imageKeys = {
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};

		return wp.element.createElement(
			'div',
			{ className: classes },
			hasBackgroundImage && wp.element.createElement(
				'div',
				{ 'class': 'background' },
				wp.element.createElement(ResponsiveImage, {
					attr: attributes,
					keys: imageKeys.backgroundImage
				})
			),
			wp.element.createElement(InnerBlocks.Content, null)
		);
	}
});
