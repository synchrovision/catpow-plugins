registerBlockType('catpow/listed', {
	title: '🐾 Listed',
	icon: 'editor-ul',
	category: 'catpow',
	attributes: {
		version: { type: 'number', default: 0 },
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-listed menu medium hasHeader hasTitle hasTitleCaption hasImage hasText' },
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				title: { source: 'children', selector: 'header .text h3' },
				titleCaption: { source: 'children', selector: 'header .text p' },
				headerImageSrc: { source: 'attribute', selector: 'header .image [src]', attribute: 'src' },
				headerImageAlt: { source: 'attribute', selector: 'header .image [src]', attribute: 'alt' },
				subImageSrc: { source: 'attribute', selector: '.contents .image [src]', attribute: 'src' },
				subImageAlt: { source: 'attribute', selector: '.contents .image [src]', attribute: 'alt' },
				src: { source: 'attribute', selector: 'li>.image [src]', attribute: 'src' },
				alt: { source: 'attribute', selector: 'li>.image [src]', attribute: 'alt' },
				subTitle: { source: 'children', selector: '.contents h4' },
				text: { source: 'children', selector: '.contents p' },
				linkUrl: { source: 'attribute', selector: '.link a', attribute: 'href' },

				backgroundImageSrc: { source: 'attribute', selector: '.background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
				backgroundImageSrcset: { source: 'attribute', selector: '.background [src]', attribute: 'srcset' }
			},
			default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
				return {
					classes: 'item',
					title: ['Title'],
					titleCaption: ['Caption'],
					headerImageSrc: cp.theme_url + '/images/dummy.jpg',
					headerImageAlt: 'dummy',
					subTitle: ['SubTitle'],
					src: cp.theme_url + '/images/dummy.jpg',
					alt: 'dummy',
					text: ['Text'],
					linkUrl: cp.home_url
				};
			})
		},
		countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
		countSuffix: { source: 'text', selector: '.counter .suffix', default: '' },
		subCountPrefix: { source: 'text', selector: '.subcounter .prefix', default: '' },
		subCountSuffix: { source: 'text', selector: '.subcounter .suffix', default: '' },
		spacer: { type: 'int', default: 0 }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var items = attributes.items,
		    classes = attributes.classes,
		    countPrefix = attributes.countPrefix,
		    countSuffix = attributes.countSuffix,
		    subCountPrefix = attributes.subCountPrefix,
		    subCountSuffix = attributes.subCountSuffix,
		    spacer = attributes.spacer,
		    dummy_image_url = attributes.dummy_image_url;

		var primaryClass = 'wp-block-catpow-listed';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var states = {
			hasHeader: false,
			hasHeaderImage: false,
			hasCounter: false,
			hasTitle: false,
			hasTitleCaption: false,
			hasSubImage: false,
			hasSubTitle: false,
			hasSubCounter: false,
			hasText: false,
			hasImage: false,
			hasLink: false,
			hasBackgroundImage: false
		};

		var selectiveClasses = [{
			label: 'タイプ',
			values: {
				flowchart: 'フロー',
				faq: 'Q&A',
				ranking: 'ランキング',
				orderd: '連番リスト',
				dialog: '会話',
				news: 'お知らせ',
				index: '目次',
				menu: 'メニュー',
				sphere: '円'
			},
			sub: {
				flowchart: [{ label: '番号', values: 'hasCounter', sub: [{ input: 'text', label: '番号前置テキスト', key: 'countPrefix' }, { input: 'text', label: '番号後置テキスト', key: 'countSuffix' }] }, { label: '画像', values: 'hasImage' }, { label: 'タイトルキャプション', values: 'hasTitleCaption' }, { label: 'サブタイトル', values: 'hasSubTitle' }, { label: 'サイズ', values: ['small', 'medium', 'large'] }, { label: 'リンク', values: 'hasLink' }],
				faq: [{ label: 'Qにキャプション', values: 'hasTitleCaption' }, { label: 'Aに見出し', values: 'hasSubTitle' }, { label: 'アコーディオン', values: 'accordion' }, { label: 'リンク', values: 'hasLink' }],
				ranking: [{ label: '画像', values: 'hasImage' }, { label: 'タイトルキャプション', values: 'hasTitleCaption' }, { label: 'サブタイトル', values: 'hasSubTitle' }, { label: 'リンク', values: 'hasLink' }],
				orderd: [{ label: '画像', values: 'hasImage' }, { input: 'text', label: '番号前置テキスト', key: 'countPrefix' }, { input: 'text', label: '番号後置テキスト', key: 'countSuffix' }, { label: 'タイトルキャプション', values: 'hasTitleCaption' }, { label: 'サブタイトル', values: 'hasSubTitle' }, { label: 'リンク', values: 'hasLink' }],
				dialog: [],
				news: [],
				index: [{ label: 'レベル', 'values': ['level0', 'level1', 'level2', 'level3'] }],
				menu: [{ label: 'サイズ', values: ['small', 'medium', 'large'] }, { label: '画像', values: { noImage: 'なし', hasImage: '大', hasHeaderImage: '小' } }, { label: '背景画像', values: 'hasBackgroundImage', sub: [{ label: '薄く', values: 'paleBG' }] }, { label: '背景色', values: 'hasBackgroundColor' }, { label: '抜き色文字', values: 'inverseText' }, { label: 'タイトルキャプション', values: 'hasTitleCaption' }, { label: 'テキスト', values: 'hasText' }, { label: 'リンク', values: 'hasLink' }],
				sphere: [{ label: 'サイズ', values: ['small', 'medium', 'large'] }, { label: '画像', values: 'hasSubImage' }, { label: 'タイトル', values: 'hasSubTitle' }, { label: 'テキスト', values: 'hasText' }]
			},
			bind: {
				flowchart: ['hasHeader', 'hasTitle', 'hasText'],
				faq: ['hasHeader', 'hasTitle', 'hasText'],
				ranking: ['hasHeader', 'hasTitle', 'hasText'],
				orderd: ['hasHeader', 'hasCounter', 'hasTitle', 'hasText'],
				dialog: ['hasHeader', 'hasHeaderImage', 'hasTitle', 'hasText'],
				news: ['hasText', 'hasSubTitle'],
				index: ['hasHeader', 'hasTitle', 'hasText'],
				menu: ['hasHeader', 'hasTitle']
			},
			item: {
				flowchart: [],
				dialog: ['color', { label: 'position', values: ['left', 'right'] }, { label: 'type', values: ['say', 'shout', 'think', 'whisper'] }],
				news: [],
				index: [],
				menu: ['color'],
				sphere: ['color']
			}
		}];

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
			image: { src: "src", alt: "alt", items: "items" },
			headerImage: { src: "headerImageSrc", alt: "headerImageAlt", items: "items" },
			subImage: { src: "subImageSrc", alt: "subImageAlt", items: "items" },
			backgroundImage: { src: "backgroundImageSrc", srcset: "backgroundImageSrcset", items: "items" }
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
					index: index
				},
				states.hasImage && wp.element.createElement(
					'div',
					{ className: 'image' },
					wp.element.createElement(SelectResponsiveImage, {
						attr: attributes,
						set: setAttributes,
						keys: imageKeys.image,
						index: index,
						size: 'vga'
					})
				),
				states.hasHeader && wp.element.createElement(
					'header',
					null,
					states.hasCounter && wp.element.createElement(
						'div',
						{ className: 'counter' },
						countPrefix && wp.element.createElement(
							'span',
							{ 'class': 'prefix' },
							countPrefix
						),
						wp.element.createElement(
							'span',
							{ className: 'number' },
							index + 1
						),
						countSuffix && wp.element.createElement(
							'span',
							{ 'class': 'suffix' },
							countSuffix
						)
					),
					states.hasHeaderImage && wp.element.createElement(
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
						states.hasTitle && states.hasTitleCaption && wp.element.createElement(
							'p',
							null,
							wp.element.createElement(RichText, {
								onChange: function onChange(text) {
									itemsCopy[index].titleCaption = text;setAttributes({ items: itemsCopy });
								},
								value: item.titleCaption
							})
						)
					)
				),
				(states.hasSubImage || states.hasSubTitle || states.hasText) && wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					states.hasSubCounter && wp.element.createElement(
						'div',
						{ className: 'subcounter' },
						subCountPrefix && wp.element.createElement(
							'span',
							{ 'class': 'prefix' },
							subCountPrefix
						),
						wp.element.createElement(
							'span',
							{ className: 'number' },
							index + 1
						),
						subCountSuffix && wp.element.createElement(
							'span',
							{ 'class': 'suffix' },
							subCountSuffix
						)
					),
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
				),
				states.hasBackgroundImage && wp.element.createElement(
					'div',
					{ className: 'background' },
					wp.element.createElement(SelectResponsiveImage, {
						attr: attributes,
						set: setAttributes,
						keys: imageKeys.backgroundImage,
						index: index
					})
				),
				states.hasLink && wp.element.createElement(
					'div',
					{ className: 'link' },
					wp.element.createElement(TextControl, { onChange: function onChange(linkUrl) {
							itemsCopy[index].linkUrl = linkUrl;
							setAttributes({ items: itemsCopy });
						}, value: item.linkUrl, placeholder: 'URL\u3092\u5165\u529B' })
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
				title: '\u30EA\u30B9\u30C8\u30A2\u30A4\u30C6\u30E0',
				icon: 'edit',
				set: setAttributes,
				attr: attributes,
				items: itemsCopy,
				index: attributes.currentItemIndex,
				triggerClasses: selectiveClasses[0]
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
		    linkText = attributes.linkText,
		    spacer = attributes.spacer;

		var classArray = _.uniq(attributes.classes.split(' '));

		var states = {
			hasHeader: false,
			hasHeaderImage: false,
			hasCounter: false,
			hasTitle: false,
			hasTitleCaption: false,
			hasSubImage: false,
			hasSubTitle: false,
			hasSubCounter: false,
			hasText: false,
			hasImage: false,
			hasLink: false,
			hasBackgroundImage: false
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
				states.hasImage && wp.element.createElement(
					'div',
					{ className: 'image' },
					wp.element.createElement('img', { src: item.src, alt: item.alt })
				),
				states.hasHeader && wp.element.createElement(
					'header',
					null,
					states.hasCounter && wp.element.createElement(
						'div',
						{ className: 'counter' },
						countPrefix && wp.element.createElement(
							'span',
							{ 'class': 'prefix' },
							countPrefix
						),
						wp.element.createElement(
							'span',
							{ className: 'number' },
							index + 1
						),
						countSuffix && wp.element.createElement(
							'span',
							{ 'class': 'suffix' },
							countSuffix
						)
					),
					states.hasHeaderImage && wp.element.createElement(
						'div',
						{ 'class': 'image' },
						wp.element.createElement('img', { src: item.headerImageSrc, alt: item.headerImageAlt })
					),
					wp.element.createElement(
						'div',
						{ className: 'text' },
						states.hasTitle && wp.element.createElement(
							'h3',
							null,
							item.title
						),
						states.hasTitle && states.hasTitleCaption && wp.element.createElement(
							'p',
							null,
							item.titleCaption
						)
					)
				),
				(states.hasSubImage || states.hasSubTitle || states.hasText) && wp.element.createElement(
					'div',
					{ 'class': 'contents' },
					states.hasSubCounter && wp.element.createElement(
						'div',
						{ className: 'subcounter' },
						subCountPrefix && wp.element.createElement(
							'span',
							{ 'class': 'prefix' },
							subCountPrefix
						),
						wp.element.createElement(
							'span',
							{ className: 'number' },
							index + 1
						),
						subCountSuffix && wp.element.createElement(
							'span',
							{ 'class': 'suffix' },
							subCountSuffix
						)
					),
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
				),
				states.hasBackgroundImage && wp.element.createElement(
					'div',
					{ className: 'background' },
					wp.element.createElement('img', { src: item.backgroundImageSrc, srcset: item.backgroundImageSrcset })
				),
				states.hasLink && item.linkUrl && wp.element.createElement(
					'div',
					{ className: 'link' },
					wp.element.createElement(
						'a',
						{ href: item.linkUrl },
						' '
					)
				)
			));
		});
		for (var i = 0; i < spacer; i++) {
			rtn.push(wp.element.createElement('li', { className: 'spacer' }));
		}
		return wp.element.createElement(
			'ul',
			{ className: classes },
			rtn
		);
	},


	deprecated: [{
		attributes: {
			version: { type: 'number', default: 0 },
			classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-listed menu hasHeader hasTitle hasImage' },
			items: {
				source: 'query',
				selector: 'li.item',
				query: {
					classes: { source: 'attribute', attribute: 'class' },
					title: { source: 'children', selector: 'header .text h3' },
					titleCaption: { source: 'children', selector: 'header .text p' },
					headerImageSrc: { source: 'attribute', selector: 'header .image [src]', attribute: 'src' },
					headerImageAlt: { source: 'attribute', selector: 'header .image [src]', attribute: 'alt' },
					src: { source: 'attribute', selector: '.contents .image [src]', attribute: 'src' },
					alt: { source: 'attribute', selector: '.contents .image [src]', attribute: 'alt' },
					subTitle: { source: 'children', selector: '.text h4' },
					text: { source: 'children', selector: '.text p' },
					linkUrl: { source: 'attribute', selector: '.text .link a', attribute: 'href' },

					backgroundImageSrc: { source: 'attribute', selector: '.background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
					backgroundImageSrcset: { source: 'attribute', selector: '.background [src]', attribute: 'srcset' }
				},
				default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
					return {
						classes: 'item',
						title: ['Title'],
						titleCaption: ['Caption'],
						headerImageSrc: cp.theme_url + '/images/dummy.jpg',
						headerImageAlt: 'dummy',
						subTitle: ['SubTitle'],
						src: cp.theme_url + '/images/dummy.jpg',
						alt: 'dummy',
						text: ['Text'],
						linkUrl: cp.home_url,
						linkText: 'もっと詳しく'
					};
				})
			},
			countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
			countSuffix: { source: 'text', selector: '.counter .suffix', default: '' },
			spacer: { type: 'int', default: 0 }
		},
		save: function save(_ref3) {
			var attributes = _ref3.attributes,
			    className = _ref3.className;
			var items = attributes.items,
			    classes = attributes.classes,
			    countPrefix = attributes.countPrefix,
			    countSuffix = attributes.countSuffix,
			    linkUrl = attributes.linkUrl,
			    linkText = attributes.linkText,
			    spacer = attributes.spacer;

			var classArray = _.uniq(attributes.classes.split(' '));

			var states = {
				hasHeader: false,
				hasHeaderImage: false,
				hasCounter: false,
				hasTitle: false,
				hasTitleCaption: false,
				hasSubTitle: false,
				hasImage: false,
				hasLink: false,
				hasBackgroundImage: false
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
					states.hasHeader && wp.element.createElement(
						'header',
						null,
						states.hasHeaderImage && wp.element.createElement(
							'div',
							{ 'class': 'image' },
							wp.element.createElement('img', { src: item.headerImageSrc, alt: item.headerImageAlt })
						),
						wp.element.createElement(
							'div',
							{ className: 'text' },
							states.hasCounter && wp.element.createElement(
								'div',
								{ className: 'counter' },
								countPrefix && wp.element.createElement(
									'span',
									{ 'class': 'prefix' },
									countPrefix
								),
								wp.element.createElement(
									'span',
									{ className: 'number' },
									index + 1
								),
								countSuffix && wp.element.createElement(
									'span',
									{ 'class': 'suffix' },
									countSuffix
								)
							),
							states.hasTitle && wp.element.createElement(
								'h3',
								null,
								item.title
							),
							states.hasTitle && states.hasTitleCaption && wp.element.createElement(
								'p',
								null,
								item.titleCaption
							)
						)
					),
					wp.element.createElement(
						'div',
						{ 'class': 'contents' },
						states.hasImage && wp.element.createElement(
							'div',
							{ className: 'image' },
							wp.element.createElement('img', { src: item.src, alt: item.alt })
						),
						wp.element.createElement(
							'div',
							{ 'class': 'text' },
							states.hasSubTitle && wp.element.createElement(
								'h4',
								null,
								item.subTitle
							),
							wp.element.createElement(
								'p',
								null,
								item.text
							)
						)
					),
					states.hasBackgroundImage && wp.element.createElement(
						'div',
						{ className: 'background' },
						wp.element.createElement('img', { src: item.backgroundImageSrc, srcset: item.backgroundImageSrcset })
					),
					states.hasLink && wp.element.createElement(
						'div',
						{ className: 'link' },
						wp.element.createElement(
							'a',
							{ href: item.linkUrl },
							' '
						)
					)
				));
			});
			for (var i = 0; i < spacer; i++) {
				rtn.push(wp.element.createElement('li', { className: 'spacer' }));
			}
			return wp.element.createElement(
				'ul',
				{ className: classes },
				rtn
			);
		},
		migrate: function migrate(attributes) {
			attributes.classes += ' hasText';
			return attributes;
		}
	}, {
		attributes: {
			version: { type: 'number', default: 0 },
			classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-listed menu hasHeader hasTitle hasImage' },
			items: {
				source: 'query',
				selector: 'li.item',
				query: {
					classes: { source: 'attribute', attribute: 'class' },
					title: { source: 'children', selector: 'header .text h3' },
					titleCaption: { source: 'children', selector: 'header .text p' },
					headerImageSrc: { source: 'attribute', selector: 'header .image [src]', attribute: 'src' },
					headerImageAlt: { source: 'attribute', selector: 'header .image [src]', attribute: 'alt' },
					src: { source: 'attribute', selector: '.image [src]', attribute: 'src' },
					alt: { source: 'attribute', selector: '.image [src]', attribute: 'alt' },
					subTitle: { source: 'children', selector: '.text h4' },
					text: { source: 'children', selector: '.text p' },
					linkUrl: { source: 'attribute', selector: '.text .link a', attribute: 'href' },

					backgroundImageSrc: { source: 'attribute', selector: '.background [src]', attribute: 'src', default: cp.theme_url + '/images/dummy.jpg' },
					backgroundImageSrcset: { source: 'attribute', selector: '.background [src]', attribute: 'srcset' }
				},
				default: [].concat(babelHelpers.toConsumableArray(Array(3))).map(function () {
					return {
						classes: 'item',
						title: ['Title'],
						titleCaption: ['Caption'],
						headerImageSrc: cp.theme_url + '/images/dummy.jpg',
						headerImageAlt: 'dummy',
						subTitle: ['SubTitle'],
						src: cp.theme_url + '/images/dummy.jpg',
						alt: 'dummy',
						text: ['Text'],
						linkUrl: cp.home_url,
						linkText: 'もっと詳しく'
					};
				})
			},
			countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
			countSuffix: { source: 'text', selector: '.counter .suffix', default: '' },
			spacer: { type: 'int', default: 0 }
		},
		save: function save(_ref4) {
			var attributes = _ref4.attributes,
			    className = _ref4.className;
			var items = attributes.items,
			    classes = attributes.classes,
			    countPrefix = attributes.countPrefix,
			    countSuffix = attributes.countSuffix,
			    linkUrl = attributes.linkUrl,
			    linkText = attributes.linkText,
			    spacer = attributes.spacer;

			var classArray = _.uniq(attributes.classes.split(' '));

			var states = {
				hasHeader: false,
				hasHeaderImage: false,
				hasCounter: false,
				hasTitle: false,
				hasTitleCaption: false,
				hasSubTitle: false,
				hasImage: false,
				hasLink: false,
				hasBackgroundImage: false
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
					states.hasImage && wp.element.createElement(
						'div',
						{ className: 'image' },
						wp.element.createElement('img', { src: item.src, alt: item.alt })
					),
					states.hasHeader && wp.element.createElement(
						'header',
						null,
						states.hasCounter && wp.element.createElement(
							'div',
							{ className: 'counter' },
							countPrefix && wp.element.createElement(
								'span',
								{ 'class': 'prefix' },
								countPrefix
							),
							wp.element.createElement(
								'span',
								{ className: 'number' },
								index + 1
							),
							countSuffix && wp.element.createElement(
								'span',
								{ 'class': 'suffix' },
								countSuffix
							)
						),
						states.hasHeaderImage && wp.element.createElement(
							'div',
							{ 'class': 'image' },
							wp.element.createElement('img', { src: item.headerImageSrc, alt: item.headerImageAlt })
						),
						wp.element.createElement(
							'div',
							{ className: 'text' },
							states.hasTitle && wp.element.createElement(
								'h3',
								null,
								item.title
							),
							states.hasTitle && states.hasTitleCaption && wp.element.createElement(
								'p',
								null,
								item.titleCaption
							)
						)
					),
					wp.element.createElement(
						'div',
						{ 'class': 'text' },
						states.hasSubTitle && wp.element.createElement(
							'h4',
							null,
							item.subTitle
						),
						wp.element.createElement(
							'p',
							null,
							item.text
						)
					),
					states.hasBackgroundImage && wp.element.createElement(
						'div',
						{ className: 'background' },
						wp.element.createElement('img', { src: item.backgroundImageSrc, srcset: item.backgroundImageSrcset })
					),
					states.hasLink && wp.element.createElement(
						'div',
						{ className: 'link' },
						wp.element.createElement(
							'a',
							{ href: item.linkUrl },
							' '
						)
					)
				));
			});
			for (var i = 0; i < spacer; i++) {
				rtn.push(wp.element.createElement('li', { className: 'spacer' }));
			}
			return wp.element.createElement(
				'ul',
				{ className: classes },
				rtn
			);
		},
		migrate: function migrate(attributes) {
			attributes.classes += ' hasText';
			return attributes;
		}
	}, {
		attributes: {
			version: { type: 'number', default: 0 },
			classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'hasTitle' },
			items: {
				source: 'query',
				selector: 'li.item',
				query: {
					classes: { source: 'attribute', attribute: 'class' },
					title: { source: 'children', selector: 'header h3' },
					titleCaption: { source: 'children', selector: 'header p' },
					src: { source: 'attribute', selector: '.contents .image [src]', attribute: 'src' },
					alt: { source: 'attribute', selector: '.contents .image [src]', attribute: 'alt' },
					subTitle: { source: 'children', selector: '.contents .text h4' },
					text: { source: 'children', selector: '.contents .text p' },
					linkUrl: { source: 'attribute', selector: '.contents .text .link a', attribute: 'href' },
					linkText: { source: 'text', selector: '.contents .text .link a' }
				}
			},
			countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
			countSuffix: { source: 'text', selector: '.counter .suffix', default: '' },
			spacer: { type: 'int', default: 0 }
		},
		save: function save(_ref5) {
			var attributes = _ref5.attributes,
			    className = _ref5.className;
			var version = attributes.version,
			    items = attributes.items,
			    classes = attributes.classes,
			    countPrefix = attributes.countPrefix,
			    countSuffix = attributes.countSuffix,
			    linkUrl = attributes.linkUrl,
			    linkText = attributes.linkText,
			    spacer = attributes.spacer;

			var classArray = _.uniq(attributes.classes.split(' '));
			var states = {
				hasHeader: false,
				hasCounter: false,
				hasTitle: false,
				hasTitleCaption: false,
				hasSubTitle: false,
				hasImage: false,
				hasLink: false,
				hasBackgroundImage: false
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
					states.hasHeader && wp.element.createElement(
						'header',
						null,
						states.hasCounter && wp.element.createElement(
							'div',
							{ className: 'counter' },
							countPrefix && wp.element.createElement(
								'span',
								{ 'class': 'prefix' },
								countPrefix
							),
							wp.element.createElement(
								'span',
								{ className: 'number' },
								index + 1
							),
							countSuffix && wp.element.createElement(
								'span',
								{ 'class': 'suffix' },
								countSuffix
							)
						),
						states.hasTitle && wp.element.createElement(
							'h3',
							null,
							item.title
						),
						states.hasTitle && states.hasTitleCaption && wp.element.createElement(
							'p',
							null,
							item.titleCaption
						)
					),
					wp.element.createElement(
						'div',
						{ 'class': 'contents' },
						states.hasImage && wp.element.createElement(
							'div',
							{ className: 'image' },
							wp.element.createElement('img', { src: item.src, alt: item.alt })
						),
						wp.element.createElement(
							'div',
							{ 'class': 'text' },
							states.hasSubTitle && wp.element.createElement(
								'h4',
								null,
								item.subTitle
							),
							wp.element.createElement(
								'p',
								null,
								item.text
							),
							states.hasLink && wp.element.createElement(
								'div',
								{ className: 'link' },
								wp.element.createElement(
									'a',
									{ href: item.linkUrl },
									item.linkText
								)
							)
						)
					)
				));
			});
			for (var i = 0; i < spacer; i++) {
				rtn.push(wp.element.createElement('li', { className: 'spacer' }));
			}
			return wp.element.createElement(
				'ul',
				{ className: classes },
				rtn
			);
		},
		migrate: function migrate(attributes) {
			attributes.classes += ' hasText';
			return attributes;
		}
	}, {
		attributes: {
			version: { type: 'number', default: 0 },
			classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'hasTitle' },
			items: {
				source: 'query',
				selector: 'li.item',
				query: {
					classes: { source: 'attribute', attribute: 'class' },
					title: { source: 'children', selector: 'h3' },
					src: { source: 'attribute', selector: '.contents .image [src]', attribute: 'src' },
					alt: { source: 'attribute', selector: '.contents .image [src]', attribute: 'alt' },
					subTitle: { source: 'children', selector: '.contents .text h4' },
					text: { source: 'children', selector: '.contents .text p' },
					linkUrl: { source: 'attribute', selector: '.contents .text .link a', attribute: 'href' },
					linkText: { source: 'text', selector: '.contents .text .link a' }
				}
			},
			countPrefix: { source: 'text', selector: '.counter .prefix', default: '' },
			countSuffix: { source: 'text', selector: '.counter .suffix', default: '' },
			spacer: { type: 'int', default: 0 }
		},
		save: function save(_ref6) {
			var attributes = _ref6.attributes,
			    className = _ref6.className;
			var version = attributes.version,
			    items = attributes.items,
			    classes = attributes.classes,
			    countPrefix = attributes.countPrefix,
			    countSuffix = attributes.countSuffix,
			    linkUrl = attributes.linkUrl,
			    linkText = attributes.linkText,
			    spacer = attributes.spacer;

			var classArray = _.uniq(attributes.classes.split(' '));
			var states = {
				hasCounter: false,
				hasTitle: false,
				hasSubTitle: false,
				hasImage: false,
				hasLink: false
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
					states.hasCounter && wp.element.createElement(
						'div',
						{ className: 'counter' },
						countPrefix && wp.element.createElement(
							'span',
							{ 'class': 'prefix' },
							countPrefix
						),
						wp.element.createElement(
							'span',
							{ className: 'number' },
							index + 1
						),
						countSuffix && wp.element.createElement(
							'span',
							{ 'class': 'suffix' },
							countSuffix
						)
					),
					states.hasTitle && wp.element.createElement(
						'h3',
						null,
						item.title
					),
					wp.element.createElement(
						'div',
						{ 'class': 'contents' },
						states.hasImage && wp.element.createElement(
							'div',
							{ className: 'image' },
							wp.element.createElement('img', { src: item.src, alt: item.alt })
						),
						wp.element.createElement(
							'div',
							{ 'class': 'text' },
							states.hasSubTitle && wp.element.createElement(
								'h4',
								null,
								item.subTitle
							),
							wp.element.createElement(
								'p',
								null,
								item.text
							),
							states.hasLink && wp.element.createElement(
								'div',
								{ className: 'link' },
								wp.element.createElement(
									'a',
									{ href: item.linkUrl },
									item.linkText
								)
							)
						)
					)
				));
			});
			for (var i = 0; i < spacer; i++) {
				rtn.push(wp.element.createElement('li', { className: 'spacer' }));
			}
			return wp.element.createElement(
				'ul',
				{ className: classes },
				rtn
			);
		},
		migrate: function migrate(attributes) {
			attributes.classes += ' hasText';
			return attributes;
		}
	}]
});
