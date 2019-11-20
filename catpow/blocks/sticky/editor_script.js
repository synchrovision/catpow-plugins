registerBlockType('catpow/sticky', {
	title: '🐾 Sticky',
	icon: 'menu',
	category: 'catpow',
	attributes: {
		classes: { source: 'attribute', selector: 'div', attribute: 'class', default: 'wp-block-catpow-sticky bottom' },

		openButtonImageSrc: { source: 'attribute', selector: '.wp-block-catpow-sticky>.stickyMenuButton [src].open', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
		closeButtonImageSrc: { source: 'attribute', selector: '.wp-block-catpow-sticky>.stickyMenuButton [src].close', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes;

		var primaryClass = 'wp-block-catpow-sticky';
		var classArray = _.uniq((className + ' ' + classes).split(' '));

		var states = {
			collapsible: false,
			imageButton: false
		};

		var imageKeys = {
			openButtonImage: { src: "openButtonImageSrc" },
			closeButtonImage: { src: "closeButtonImageSrc" }
		};

		var selectiveClasses = [{ label: '位置', values: { left: '左', right: '右', top: '上', bottom: '下' } }, {
			label: '折り畳み',
			values: 'collapsible',
			sub: ['color', {
				label: 'ボタンタイプ',
				values: { pullButton: '引き出し', menuButton: 'メニュー' },
				sub: {
					imageButton: [{ label: 'open', input: 'image', keys: imageKeys.openButtonImage, size: 'thumbnail' }, { label: 'close', input: 'image', keys: imageKeys.closeButtonImage, size: 'thumbnail' }]
				}
			}, { label: '画像ボタン', values: 'imageButton',
				sub: [{ label: 'open', input: 'image', keys: imageKeys.openButtonImage, size: 'thumbnail' }, { label: 'close', input: 'image', keys: imageKeys.closeButtonImage, size: 'thumbnail' }]
			}, { label: 'ボタンの位置', values: {
					buttonPositionStart: '上・左',
					buttonPositionCenter: '中央',
					buttonPositionEnd: '下・右'
				} }, { label: 'サイズ', values: { fill: '全面', large: '大', small: '小' } }]
		}];

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		return [wp.element.createElement(
			'div',
			{ className: classes },
			states.collapsible && wp.element.createElement(
				'div',
				{ 'class': 'stickyMenuButton' },
				wp.element.createElement(
					'div',
					{ 'class': 'stickyMenuButtonIcon' },
					states.imageButton && [wp.element.createElement(ResponsiveImage, {
						className: 'open',
						attr: attributes,
						keys: imageKeys.openButtonImage
					}), wp.element.createElement(ResponsiveImage, {
						className: 'close',
						attr: attributes,
						keys: imageKeys.closeButtonImage
					})]
				)
			),
			wp.element.createElement(
				'div',
				{ 'class': 'content' },
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
		var collapsible = hasClass('collapsible');
		var imageButton = hasClass('imageButton');

		var imageKeys = {
			openButtonImage: { src: "openButtonImageSrc" },
			closeButtonImage: { src: "closeButtonImageSrc" }
		};

		return wp.element.createElement(
			'div',
			{ className: classes },
			collapsible && wp.element.createElement(
				'div',
				{ 'class': 'stickyMenuButton' },
				wp.element.createElement(
					'div',
					{ 'class': 'stickyMenuButtonIcon' },
					imageButton && [wp.element.createElement(ResponsiveImage, {
						className: 'open',
						attr: attributes,
						keys: imageKeys.openButtonImage
					}), wp.element.createElement(ResponsiveImage, {
						className: 'close',
						attr: attributes,
						keys: imageKeys.closeButtonImage
					})]
				)
			),
			wp.element.createElement(
				'div',
				{ 'class': 'content' },
				wp.element.createElement(InnerBlocks.Content, null)
			)
		);
	}
});
