registerBlockType('catpow/dialog', {
	title: '🐾 Dialog',
	icon: 'format-chat',
	category: 'catpow',
	transforms: {
		from: [{
			type: 'block',
			blocks: CP.listedConvertibles,
			transform: function transform(attributes) {
				attributes.classes = 'wp-block-catpow-dialog';
				return createBlock('catpow/dialog', attributes);
			}
		}]
	},
	attributes: {
		version: { type: 'number', default: 0 },
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-dialog' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				title: { source: 'children', selector: 'header .text h3' },
				headerImageSrc: { source: 'attribute', selector: 'header .image [src]', attribute: 'src' },
				headerImageAlt: { source: 'attribute', selector: 'header .image [src]', attribute: 'alt' },
				text: { source: 'children', selector: '.contents p' }
			},
			default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
				return {
					classes: 'item left',
					title: ['Title'],
					titleCaption: ['Caption'],
					headerImageSrc: cp.theme_url + '/images/dummy.jpg',
					headerImageAlt: 'dummy',
					text: ['Text']
				};
			})
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes,
		    isSelected = _ref.isSelected;
		var items = attributes.items,
		    classes = attributes.classes,
		    countPrefix = attributes.countPrefix,
		    countSuffix = attributes.countSuffix,
		    subCountPrefix = attributes.subCountPrefix,
		    subCountSuffix = attributes.subCountSuffix;

		var primaryClass = 'wp-block-catpow-dialog';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var itemClasses = ['color', { label: 'position', values: ['left', 'right'] }, { label: 'type', filter: 'type', values: ['say', 'shout', 'think', 'whisper'] }];

		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var rtn = [];
		var imageKeys = {
			headerImage: { src: "headerImageSrc", alt: "headerImageAlt", items: "items" }
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
					'header',
					null,
					wp.element.createElement(
						'div',
						{ className: 'image' },
						wp.element.createElement(SelectResponsiveImage, {
							attr: attributes,
							set: setAttributes,
							keys: imageKeys.headerImage,
							index: index,
							size: 'thumbnail'
						})
					),
					wp.element.createElement(
						'div',
						{ className: 'text' },
						wp.element.createElement(
							'h3',
							null,
							wp.element.createElement(RichText, {
								onChange: function onChange(text) {
									itemsCopy[index].title = text;setAttributes({ items: itemsCopy });
								},
								value: item.title
							})
						)
					)
				),
				wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					wp.element.createElement(
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
				title: '\u30EA\u30B9\u30C8\u30A2\u30A4\u30C6\u30E0',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				itemClasses: itemClasses,
				filters: CP.filters.dialog || {}
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
		    countSuffix = attributes.countSuffix,
		    subCountPrefix = attributes.subCountPrefix,
		    subCountSuffix = attributes.subCountSuffix,
		    linkUrl = attributes.linkUrl,
		    linkText = attributes.linkText;

		var classArray = _.uniq(attributes.classes.split(' '));

		var rtn = [];
		items.map(function (item, index) {
			rtn.push(wp.element.createElement(
				'li',
				{ className: item.classes },
				wp.element.createElement(
					'header',
					null,
					wp.element.createElement(
						'div',
						{ 'class': 'image' },
						wp.element.createElement('img', { src: item.headerImageSrc, alt: item.headerImageAlt })
					),
					wp.element.createElement(
						'div',
						{ className: 'text' },
						wp.element.createElement(
							'h3',
							null,
							item.title
						)
					)
				),
				wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					wp.element.createElement(
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
