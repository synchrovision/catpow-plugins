registerBlockType('catpow/sphere', {
	title: '🐾 Sphere',
	icon: 'image-filter',
	category: 'catpow',
	transforms: {
		from: [{
			type: 'block',
			blocks: CP.listedConvertibles,
			transform: function transform(attributes) {
				attributes.classes = 'wp-block-catpow-sphere medium hasSubTitle hasText';
				return createBlock('catpow/sphere', attributes);
			}
		}]
	},
	attributes: {
		version: { type: 'number', default: 0 },
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-sphere' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				subImageSrc: { source: 'attribute', selector: '.contents .image [src]', attribute: 'src' },
				subImageAlt: { source: 'attribute', selector: '.contents .image [src]', attribute: 'alt' },
				subTitle: { source: 'children', selector: '.contents h4' },
				text: { source: 'children', selector: '.contents p' }
			},
			default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
				return {
					classes: 'item',
					title: ['Title'],
					titleCaption: ['Caption'],
					subTitle: ['SubTitle'],
					src: cp.theme_url + '/images/dummy.jpg',
					alt: 'dummy',
					text: ['Text'],
					linkUrl: cp.home_url
				};
			})
		},
		countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
		countSuffix: { source: 'text', selector: '.counter .suffix', default: '' }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
			className = _ref.className,
			setAttributes = _ref.setAttributes,
			isSelected = _ref.isSelected;
		var items = attributes.items,
			classes = attributes.classes,
			countPrefix = attributes.countPrefix,
			countSuffix = attributes.countSuffix;

		var primaryClass = 'wp-block-catpow-sphere';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var states = {
			hasSubImage: false,
			hasSubTitle: false,
			hasText: false
		};

		var selectiveClasses = [{ label: 'サイズ', filter: 'size', values: ['small', 'medium', 'large'] }, { label: '画�?', values: 'hasSubImage' }, { label: 'タイトル', values: 'hasSubTitle' }, { label: '�?��ス�?', values: 'hasText' }];

		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		var rtn = [];
		var imageKeys = {
			image: { src: "src", alt: "alt", items: "items" }
		};

		itemsCopy.map(function (item, index) {
			if (!item.controlClasses) {
				item.controlClasses = 'control';
			}
			rtn.push(wp.element.createElement(
				Item,
				{
					tag: 'li',
					set: setAttributes,
					attr: attributes,
					items: itemsCopy,
					index: index,
					isSelected: isSelected
				},
				wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					states.hasSubImage && wp.element.createElement(
						'div',
						{ className: 'image' },
						wp.element.createElement(SelectResponsiveImage, {
							attr: attributes,
							set: setAttributes,
							keys: imageKeys.subImage,
							index: index,
							size: 'medium'
						})
					),
					states.hasSubTitle && wp.element.createElement(
						'h4',
						null,
						wp.element.createElement(RichText, {
							onChange: function onChange(subTitle) {
								itemsCopy[index].subTitle = subTitle;setAttributes({ items: itemsCopy });
							},
							value: item.subTitle,
							placeholder: 'SubTitle'
						})
					),
					states.hasText && wp.element.createElement(
						'p',
						null,
						wp.element.createElement(RichText, {
							onChange: function onChange(text) {
								itemsCopy[index].text = text;setAttributes({ items: itemsCopy });
							},
							value: item.text
						})
					)
				)
			));
		});

		if (attributes.EditMode === undefined) {
			attributes.EditMode = false;
		}

		return [wp.element.createElement(
			BlockControls,
			null,
			wp.element.createElement(Toolbar, {
				controls: [{
					icon: 'edit',
					title: 'EditMode',
					isActive: attributes.EditMode,
					onClick: function onClick() {
						return setAttributes({ EditMode: !attributes.EditMode });
					}
				}]
			})
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
			),
			wp.element.createElement(SelectItemClassPanel, {
				title: '\u30A2\u30A4\u30C6\u30E0',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				itemClasses: ['color']
			}),
			wp.element.createElement(ItemControlInfoPanel, null)
		), wp.element.createElement(
			'ul',
			{ className: attributes.EditMode ? primaryClass + ' edit' : classes },
			rtn
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
			className = _ref2.className;
		var items = attributes.items,
			classes = attributes.classes,
			countPrefix = attributes.countPrefix,
			countSuffix = attributes.countSuffix;

		var classArray = _.uniq(attributes.classes.split(' '));

		var states = {
			hasSubImage: false,
			hasSubTitle: false,
			hasText: false
		};
		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		var rtn = [];
		items.map(function (item, index) {
			rtn.push(wp.element.createElement(
				'li',
				{ className: item.classes },
				wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					states.hasSubImage && wp.element.createElement(
						'div',
						{ className: 'image' },
						wp.element.createElement('img', { src: item.subImageSrc, alt: item.subImageAlt })
					),
					states.hasSubTitle && wp.element.createElement(
						'h4',
						null,
						item.subTitle
					),
					states.hasText && wp.element.createElement(
						'p',
						null,
						item.text
					)
				)
			));
		});
		return wp.element.createElement(
			'ul',
			{ className: classes },
			rtn
		);
	}
});
