registerBlockType('catpow/div', {
	title: '🐾 Div',
	icon: 'editor-code',
	category: 'catpow',
	transforms: {
		from: [{
			type: 'block',
			blocks: ['core/group'],
			transform: function transform(attributes, innerBlocks) {
				return createBlock('catpow/div', { classes: 'wp-block-catpow-div frame thinBorder' }, innerBlocks);
			}
		}]
	},
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-div frame thinBorder' },

		iconImageSrc: { source: 'attribute', selector: '.wp-block-catpow-div>.icon [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },

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
			hasIcon: false,
			hasBackgroundImage: false
		};

		var imageKeys = {
			iconImage: { src: "iconImageSrc" },
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};

		var selectiveClasses = [{
			label: 'タイプ',
			filter: 'type',
			values: ['block', 'frame', 'columns'],
			sub: {
				frame: [{ label: '色', values: 'hasColor', sub: ['color'] }, { label: 'パターン', values: 'hasPattern', sub: ['pattern'] }, { label: 'アイコン', values: 'hasIcon' }, { label: '線', values: { noBorder: 'なし', thinBorder: '細', boldBorder: '太' } }, { label: '角丸', values: 'round' }, { label: '影', values: 'shadow', sub: [{ label: '内側', values: 'inset' }] }],
				columns: [{ label: '幅', values: { narrow: '狭い', regular: '普通', wide: '広い' } }]
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
			states.hasIcon && wp.element.createElement(
				'div',
				{ 'class': 'icon' },
				wp.element.createElement(SelectResponsiveImage, {
					set: setAttributes,
					attr: attributes,
					keys: imageKeys.iconImage,
					size: 'middle'
				})
			),
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
		var hasIcon = hasClass('hasIcon');
		var hasBackgroundImage = hasClass('hasBackgroundImage');

		var imageKeys = {
			iconImage: { src: "iconImageSrc" },
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset" }
		};

		return wp.element.createElement(
			'div',
			{ className: classes },
			hasIcon && wp.element.createElement(
				'div',
				{ 'class': 'icon' },
				wp.element.createElement(ResponsiveImage, {
					attr: attributes,
					keys: imageKeys.iconImage
				})
			),
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
