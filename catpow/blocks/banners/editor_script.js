registerBlockType('catpow/banners', {
	title: '🐾 Banners',
	description: 'リンク付きのバナー画像を並べて表示するブロックです。',
	icon: 'images-alt',
	category: 'catpow',
	transforms: {
		from: [{
			type: 'block',
			blocks: CP.listedConvertibles,
			transform: function transform(attributes) {
				attributes.classes = 'wp-block-catpow-banners medium hasTitle';
				return createBlock('catpow/banners', attributes);
			}
		}]
	},
	attributes: {
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-banners medium hasTitle' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				title: { source: 'children', selector: 'h3' },
				src: { source: 'attribute', selector: '[src]', attribute: 'src' },
				srcset: { source: 'attribute', selector: '[src]', attribute: 'srcset' },
				alt: { source: 'attribute', selector: '[src]', attribute: 'alt' },
				linkUrl: { source: 'attribute', selector: 'a', attribute: 'href' },
				target: { source: 'attribute', selector: 'a', attribute: 'target' },
				event: { source: 'attribute', selector: 'a', attribute: 'data-event' },
				loopImage: { source: 'text', selector: 'a' }
			},
			default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
				return {
					classes: 'item',
					title: ['Title'],
					src: cp.theme_url + '/images/dummy.jpg',
					alt: 'dummy',
					linkUrl: cp.home_url,
					loopImage: '[output image]'
				};
			})
		},
		loopParam: { type: 'text', default: '' },
		loopCount: { type: 'number', default: 1 }
	},
	example: CP.example,
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes,
		    isSelected = _ref.isSelected;
		var items = attributes.items,
		    classes = attributes.classes,
		    loopCount = attributes.loopCount,
		    loopImage = attributes.loopImage;

		var primaryClass = 'wp-block-catpow-banners';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var states = CP.wordsToFlags(classes);
		var imageKeys = {
			image: { src: "src", srcset: "srcset", alt: "alt", items: "items" }
		};

		var selectiveClasses = [{ label: 'サイズ', values: ['small', 'medium', 'large'] }, { label: 'タイトル', values: 'hasTitle' }, {
			label: 'テンプレート',
			values: 'isTemplate',
			sub: [{ label: 'ループ', values: 'doLoop', sub: [{ label: 'パラメータ', input: 'text', key: 'loopParam' }, { label: 'ループ数', input: 'range', key: 'loopCount', min: 1, max: 16 }] }]
		}];
		var selectiveItemClasses = [{ input: 'image', label: 'PC版画像', keys: imageKeys.image }, { input: 'image', label: 'SP版画像', keys: imageKeys.image, ofSP: true, sizes: '480px' }, { input: 'text', label: 'alt', key: 'alt' }, { input: 'text', label: 'target', key: 'target' }, 'event'];
		var itemTemplateSelectiveClasses = [{ input: 'text', label: '画像', key: 'loopImage' }];

		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var rtn = [];

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
				states.hasTitle && wp.element.createElement(
					'h3',
					null,
					wp.element.createElement(RichText, {
						onChange: function onChange(text) {
							itemsCopy[index].title = text;setAttributes({ items: itemsCopy });
						},
						value: item.title
					})
				),
				wp.element.createElement(
					'a',
					null,
					states.isTemplate ? wp.element.createElement(DummyImage, { text: item.loopImage }) : wp.element.createElement(SelectResponsiveImage, {
						attr: attributes,
						set: setAttributes,
						keys: imageKeys.image,
						index: index,
						size: 'vga'
					})
				),
				isSelected && wp.element.createElement(
					'div',
					{ className: 'link' },
					wp.element.createElement(
						'p',
						{
							contentEditable: true,
							onBlur: function onBlur(e) {
								itemsCopy[index].linkUrl = e.currentTarget.innerHTML;
								setAttributes({ items: itemsCopy });
							}
						},
						item.linkUrl
					)
				)
			));
		});

		if (attributes.EditMode === undefined) {
			attributes.EditMode = false;
		}
		if (rtn.length < loopCount) {
			var len = rtn.length;
			while (rtn.length < loopCount) {
				rtn.push(rtn[rtn.length % len]);
			}
		}

		return [wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses,
				filters: CP.filters.banners || {}
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
			states.isTemplate ? wp.element.createElement(SelectItemClassPanel, {
				title: '\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				itemClasses: itemTemplateSelectiveClasses,
				filters: CP.filters.banners || {}
			}) : wp.element.createElement(SelectItemClassPanel, {
				title: '\u30D0\u30CA\u30FC',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				itemClasses: selectiveItemClasses,
				filters: CP.filters.banners || {}
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
		    loopParam = attributes.loopParam;


		var states = CP.wordsToFlags(classes);
		var imageKeys = {
			image: { src: "src", srcset: "srcset", alt: "alt", items: "items" }
		};

		return wp.element.createElement(
			'ul',
			{ className: classes },
			states.doLoop && '[loop_template ' + loopParam + ']',
			items.map(function (item, index) {
				return wp.element.createElement(
					'li',
					{ className: item.classes },
					states.hasTitle && wp.element.createElement(
						'h3',
						null,
						item.title
					),
					wp.element.createElement(
						'a',
						{ href: item.linkUrl, target: item.target, 'data-event': item.event, rel: item.target ? 'noopener noreferrer' : '' },
						states.isTemplate ? item.loopImage : wp.element.createElement(ResponsiveImage, {
							attr: attributes,
							keys: imageKeys.image,
							index: index
						})
					)
				);
			}),
			states.doLoop && '[/loop_template]'
		);
	}
});
