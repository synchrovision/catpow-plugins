registerBlockType('catpow/slick', {
	title: '🐾 Slick',
	icon: 'video-alt3',
	category: 'layout',

	attributes: {
		classes: { source: 'attribute', selector: 'ul', attribute: 'class', default: 'wp-block-catpow-slick hasTitle hasText hasImage articles' },
		slick: {
			source: 'attribute',
			selector: 'ul',
			attribute: 'data-slick',
			default: '{"slidesToShow":"3"}'
		},
		items: {
			source: 'query',
			selector: 'li.item',
			query: {
				title: { source: 'children', selector: '.text h3' },
				subTitle: { source: 'children', selector: '.text h4' },
				src: { source: 'attribute', selector: '.image img', attribute: 'src' },
				alt: { source: 'attribute', selector: '.image img', attribute: 'alt' },
				text: { source: 'children', selector: '.text p' },
				url: { source: 'attribute', selector: 'a', attribute: 'href' },
				bg: { source: 'attribute', attribute: 'style' }
			},
			default: []
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes;
		var classes = attributes.classes,
		    slick = attributes.slick,
		    items = attributes.items;

		var primaryClass = 'wp-block-catpow-slick';
		var classArray = _.uniq((className + ' ' + classes).split(' '));

		var slickDefault = {
			accessibility: true,
			adaptiveHeight: false,
			autoplay: false,
			autoplaySpeed: 3000,
			arrows: true,
			asNavFor: null,
			centerMode: false,
			centerPadding: '50px',
			cssEase: 'ease',
			dots: false,
			draggable: true,
			fade: false,
			focusOnSelect: false,
			infinite: true,
			initialSlide: 0,
			pauseOnFocus: true,
			pauseOnHover: true,
			pauseOnDotsHover: false,
			respondTo: 'window',
			responsive: null,
			rows: 1,
			slidesPerRow: 1,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 300,
			swipe: true,
			swipeToSlide: false,
			touchMove: true,
			touchThreshold: 5,
			variableWidth: false,
			vertical: false,
			verticalSwiping: false,
			rtl: false,
			waitForAnimate: true
		};

		var slickData = jQuery.extend(true, {}, slickDefault, JSON.parse(slick));
		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var media_uploader = wp.media({
			title: 'Select Image',
			button: { text: 'Select' },
			multiple: false
		});
		var selectImage = function selectImage(index, srcAttr, altAttr) {
			var asBG = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			media_uploader.off('select');
			media_uploader.on('select', function () {
				var image = media_uploader.state().get('selection').first().toJSON();
				if (asBG) {
					itemsCopy[index][srcAttr] = { backgroundImage: 'url(\'' + image.url + '\')' };
				} else {
					itemsCopy[index][srcAttr] = image.url;
				}
				if (altAttr) {
					itemsCopy[index][altAttr] = image.alt;
				}
				setAttributes({ items: itemsCopy });
			});
			media_uploader.open();
		};

		var deleteItem = function deleteItem(index) {
			itemsCopy.splice(index, 1);
			setAttributes({ items: itemsCopy });
		};
		var cloneItem = function cloneItem(index) {
			itemsCopy.splice(index, 0, jQuery.extend(true, {}, itemsCopy[index]));
			setAttributes({ items: itemsCopy });
		};
		var upItem = function upItem(index) {
			if (!itemsCopy[index - 1]) return false;
			itemsCopy.splice(index - 1, 2, itemsCopy[index], itemsCopy[index - 1]);
			setAttributes({ items: itemsCopy });
		};
		var downItem = function downItem(index) {
			if (!itemsCopy[index + 1]) return false;
			itemsCopy.splice(index, 2, itemsCopy[index + 1], itemsCopy[index]);
			setAttributes({ items: itemsCopy });
		};
		var slickGoto = function slickGoto(index) {
			setSlick({ initialSlide: (index + items.length) % items.length });
		};
		var slickPrev = function slickPrev() {
			slickGoto(slickData.initialSlide - 1);
		};
		var slickNext = function slickNext() {
			slickGoto(slickData.initialSlide + 1);
		};

		var states = {
			hasTitle: false,
			hasSubTitle: false,
			hasText: false,
			hasImage: false,
			hasBackgroundImage: false
		};

		var selectiveClasses = ['mainvisual', 'articles', 'thumbnails'];

		var switchSelectiveClass = function switchSelectiveClass(cls) {
			var classNameArray = className.split(' ');
			classNameArray = _.difference(classNameArray, [primaryClass], selectiveClasses);
			classNameArray.push(cls);
			setAttributes({ className: classNameArray.join(' ') });
		};
		var getSelectiveClass = function getSelectiveClass() {
			return _.intersection(classArray, selectiveClasses).shift();
		};

		var toggleClass = function toggleClass(cls) {
			var i = classArray.indexOf(cls);
			if (i === -1) {
				classArray.push(cls);
			} else {
				classArray.splice(i, 1);
			}
			setAttributes({ classes: classArray.join(' ') });
		};
		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};

		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		if (className === primaryClass) {
			var additionalClassArray = classArray.filter(function (cls) {
				if (cls === primaryClass) return false;
				if (cls in states) return false;
				return true;
			});
			if (additionalClassArray.length) {
				setAttributes({ className: additionalClassArray.join(' ') });
			}
		} else {
			var classNameArray = className.split(' ');
			var hasRemovedClass = false;
			classArray = _.union(classArray, classNameArray);
			var classArray = classArray.filter(function (cls) {
				if (classNameArray.indexOf(cls) !== -1) return true;
				if (cls in states) return true;
				hasRemovedClass = true;
				return false;
			});
			if (hasRemovedClass) {
				setAttributes({ classes: classArray.join(' ') });
			}
		}

		var setSlick = function setSlick(conf) {
			var slickDataCopy = _.extend(slickData, conf);
			Object.keys(slickDataCopy).forEach(function (key) {
				if (slickDefault[key] == slickDataCopy[key]) {
					delete slickDataCopy[key];
				}
			});
			setAttributes({ slick: JSON.stringify(slickDataCopy) });
		};

		var rtn = [];

		var pushItem = function pushItem(item, index) {
			if (states.hasBackgroundImage) {
				if (typeof item.bg === 'string') {
					item.bg = { backgroundImage: item.bg.substr('background-image:'.length) };
				}
			} else {
				item.bg = {};
			}
			rtn.push(wp.element.createElement(
				'li',
				{ onKeyDown: function onKeyDown(e) {
						if (e.ctrlKey || e.metaKey) {
							var doSomething = true;
							switch (e.key) {
								case 'd':
									cloneItem(index);break;
								case 'Backspace':
									deleteItem(index);break;
								case 'ArrowUp':
									upItem(index);break;
								case 'ArrowDown':
									downItem(index);break;
								case 'ArrowLeft':
									slickPrev();break;
								case 'ArrowRight':
									slickNext();break;
								default:
									doSomething = false;
							}
							if (doSomething) {
								e.preventDefault();
							}
						}
					},
					'class': 'item', style: item.bg },
				states.hasImage && wp.element.createElement(
					'div',
					{ className: 'image' },
					wp.element.createElement('img', { onClick: function onClick(e) {
							selectImage(index, 'src', 'alt');
						}, src: item.src, alt: item.alt })
				),
				wp.element.createElement(
					'div',
					{ 'class': 'text' },
					states.hasTitle && wp.element.createElement(RichText, {
						tagName: 'h3',
						onChange: function onChange(text) {
							itemsCopy[index].title = text;setAttributes({ items: itemsCopy });
						},
						value: item.title
					}),
					states.hasSubTitle && wp.element.createElement(RichText, {
						tagName: 'h4',
						onChange: function onChange(subTitle) {
							itemsCopy[index].subTitle = subTitle;setAttributes({ items: itemsCopy });
						},
						value: item.subTitle
					}),
					states.hasText && wp.element.createElement(RichText, {
						tagName: 'p',
						onChange: function onChange(text) {
							itemsCopy[index].text = text;setAttributes({ items: itemsCopy });
						},
						value: item.text
					})
				),
				wp.element.createElement(
					'div',
					{ 'class': 'control' },
					wp.element.createElement('div', { className: 'btn delete', onClick: function onClick(e) {
							return deleteItem(index);
						} }),
					wp.element.createElement('div', { className: 'btn clone', onClick: function onClick(e) {
							return cloneItem(index);
						} })
				)
			));
		};

		var l = items.length;
		for (var i = slickData.initialSlide - Math.floor(slickData.slidesToShow / 2) + l, to = slickData.initialSlide + Math.ceil(slickData.slidesToShow / 2) + l; i < to; i++) {
			pushItem(items[i % l], i % l);
		}

		var setSlidesToShow = function setSlidesToShow(bp, n) {
			var m = slickData.slidesToShow;
			var rsp = [];
			if (slickData.responsive) {
				var prev = m;
				if (!slickData.responsive.some(function (val) {
					if (val.breakpoint == bp) {
						val.settings.slidesToShow = n;return true;
					}
					return false;
				})) {
					slickData.responsive.push({
						breakpoint: bp,
						settings: {
							slidesToShow: n
						}
					});
					slickData.responsive.sort(function (a, b) {
						parseInt(b.breakpoint) - parseInt(a.breakpoint);
					});
				}
				rsp = slickData.responsive.filter(function (val) {
					if (prev == val.settings.slidesToShow) {
						return false;
					}
					prev = val.settings.slidesToShow;
					return true;
				});
				if (rsp.lengh == 0) {
					rsp = null;
				}
			} else {
				if (m == n) {
					return false;
				}
				rsp = [{
					breakpoint: bp,
					settings: {
						slidesToShow: n
					}
				}];
			}

			setSlick({ responsive: rsp });
		};
		var getSlidesToShow = function getSlidesToShow(bp) {
			if (slickData.responsive) {
				for (var _i = slickData.responsive.length - 1; _i >= 0; _i--) {
					if (slickData.responsive[_i].breakpoint >= bp) {
						return slickData.responsive[_i].settings.slidesToShow;
					}
				}
			}
			return slickData.slidesToShow;
		};

		return [wp.element.createElement(
			'ul',
			{ className: classArray.join(' '), 'data-slick': slick },
			rtn
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(
				PanelBody,
				{ title: '\u8868\u793A\u8A2D\u5B9A', initialOpen: false, icon: 'admin-appearance' },
				wp.element.createElement(CheckboxControl, {
					label: '\u30BF\u30A4\u30C8\u30EB',
					onChange: function onChange(hasTitle) {
						toggleClass('hasTitle');
					},
					checked: states.hasTitle
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB',
					onChange: function onChange(hasSubTitle) {
						toggleClass('hasSubTitle');
					},
					checked: states.hasSubTitle
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30C6\u30AD\u30B9\u30C8',
					onChange: function onChange(hasText) {
						toggleClass('hasText');
					},
					checked: states.hasText
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u753B\u50CF',
					onChange: function onChange(hasImage) {
						toggleClass('hasImage');
					},
					checked: states.hasImage
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u80CC\u666F\u753B\u50CF',
					onChange: function onChange(hasBackgroundImage) {
						toggleClass('hasBackgroundImage');
					},
					checked: states.hasBackgroundImage
				}),
				states.hasBackgroundImage && wp.element.createElement(
					'div',
					{ className: 'imageSelector', onClick: function onClick() {
							return selectImage(slickData.initialSlide, 'bg', false, true);
						}, style: items[slickData.initialSlide].bg },
					'\u3000'
				),
				wp.element.createElement(RangeControl, {
					label: '\u8868\u793A\u30B9\u30E9\u30A4\u30C9',
					onChange: function onChange(n) {
						setSlick({ initialSlide: n });
					},
					value: slickData.initialSlide,
					min: 0,
					max: items.length - 1
				}),
				wp.element.createElement(RangeControl, {
					label: '\u8868\u793A\u6570',
					onChange: function onChange(n) {
						setSlick({ slidesToShow: n });
					},
					value: slickData.slidesToShow,
					min: 1,
					max: items.length
				}),
				wp.element.createElement(RangeControl, {
					label: '\u30BF\u30D6\u30EC\u30C3\u30C8\u8868\u793A\u6570',
					onChange: function onChange(n) {
						setSlidesToShow(800, n);
					},
					value: getSlidesToShow(800),
					min: 1,
					max: items.length
				}),
				wp.element.createElement(RangeControl, {
					label: '\u30B9\u30DE\u30DB\u8868\u793A\u6570',
					onChange: function onChange(n) {
						setSlidesToShow(480, n);
					},
					value: getSlidesToShow(480),
					min: 1,
					max: items.length
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30A2\u30ED\u30FC',
					onChange: function onChange(arrows) {
						setSlick({ arrows: arrows });
					},
					checked: slickData.arrows
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30C9\u30C3\u30C8',
					onChange: function onChange(dots) {
						setSlick({ dots: dots });
					},
					checked: slickData.dots
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: '\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u8A2D\u5B9A', initialOpen: false, icon: 'video-alt3' },
				wp.element.createElement(CheckboxControl, {
					label: '\u81EA\u52D5\u518D\u751F',
					onChange: function onChange(autoplay) {
						setSlick({ autoplay: autoplay });
					},
					checked: slickData.autoplay
				}),
				slickData.autoplay && wp.element.createElement(RangeControl, {
					label: '\u81EA\u52D5\u518D\u751F\u9593\u9694\uFF08\u5358\u4F4D\u79D2\uFF09',
					onChange: function onChange(n) {
						setSlick({ autoplaySpeed: n * 1000 });
					},
					value: slickData.autoplaySpeed / 1000,
					min: 0,
					max: 10
				}),
				wp.element.createElement(RangeControl, {
					label: '\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u6642\u9593\uFF08\u5358\u4F4D:0.1\u79D2\uFF09',
					onChange: function onChange(n) {
						setSlick({ speed: n * 100 });
					},
					value: slickData.speed / 100,
					min: 0,
					max: 100
				}),
				wp.element.createElement(SelectControl, {
					label: '\u30A4\u30FC\u30B8\u30F3\u30B0',
					onChange: function onChange(cssEase) {
						setSlick({ cssEase: cssEase });
					},
					selected: slickData.cssEase,
					options: [{ label: 'あり', value: 'ease' }, { label: 'なし', value: 'linear' }]
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30EB\u30FC\u30D7',
					onChange: function onChange(infinite) {
						setSlick({ infinite: infinite });
					},
					checked: slickData.infinite
				}),
				wp.element.createElement(CheckboxControl, {
					label: '\u30D5\u30A7\u30FC\u30C9',
					onChange: function onChange(fade) {
						setSlick({ fade: fade });
					},
					checked: slickData.fade
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: '\u62E1\u5F35\u8A2D\u5B9A', initialOpen: false, icon: 'universal-access' },
				wp.element.createElement(CheckboxControl, {
					label: '\u30AD\u30FC\u30DC\u30FC\u30C9\u3067\u64CD\u4F5C',
					onChange: function onChange(accessibility) {
						setSlick({ accessibility: accessibility });
					},
					checked: slickData.accessibility
				}),
				wp.element.createElement(TextControl, {
					label: '\u9023\u52D5',
					onChange: function onChange(asNavFor) {
						setSlick({ asNavFor: asNavFor });
					},
					value: slickData.asNavFor
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: '\u30AF\u30E9\u30B9', initialOpen: false, icon: 'art' },
				wp.element.createElement(SelectControl, {
					label: '\u30AF\u30E9\u30B9',
					onChange: switchSelectiveClass,
					value: getSelectiveClass(),
					options: selectiveClasses.map(function (cls) {
						return { label: cls, value: cls };
					})
				})
			),
			wp.element.createElement(
				PanelBody,
				{ title: '\u64CD\u4F5C', initialOpen: false, icon: 'info' },
				wp.element.createElement(
					'table',
					null,
					wp.element.createElement(
						'tbody',
						null,
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + D'
							),
							wp.element.createElement(
								'td',
								null,
								'\u8907\u88FD'
							)
						),
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + delete'
							),
							wp.element.createElement(
								'td',
								null,
								'\u524A\u9664'
							)
						),
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + \u2190'
							),
							wp.element.createElement(
								'td',
								null,
								'\u524D\u306E\u30B9\u30E9\u30A4\u30C9\u3092\u8868\u793A'
							)
						),
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + \u2192'
							),
							wp.element.createElement(
								'td',
								null,
								'\u6B21\u306E\u30B9\u30E9\u30A4\u30C9\u3092\u8868\u793A'
							)
						),
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + \u2191'
							),
							wp.element.createElement(
								'td',
								null,
								'\u524D\u306E\u30B9\u30E9\u30A4\u30C9\u3068\u5165\u308C\u66FF\u3048'
							)
						),
						wp.element.createElement(
							'tr',
							null,
							wp.element.createElement(
								'th',
								null,
								'\u2318/Ctrl + \u2193'
							),
							wp.element.createElement(
								'td',
								null,
								'\u6B21\u306E\u30B9\u30E9\u30A4\u30C9\u3068\u5165\u308C\u66FF\u3048'
							)
						)
					)
				)
			)
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className,
		    setAttributes = _ref2.setAttributes;
		var classes = attributes.classes,
		    slick = attributes.slick,
		    items = attributes.items;


		var classArray = classes.split(' ');

		var states = {
			hasTitle: false,
			hasSubTitle: false,
			hasText: false,
			hasImage: false,
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
			if (states.hasBackgroundImage) {
				if (typeof item.bg === 'string') {
					item.bg = { backgroundImage: item.bg.substr('background-image:'.length) };
				}
			} else {
				item.bg = {};
			}
			rtn.push(wp.element.createElement(
				'li',
				{ 'class': 'item', style: item.bg },
				states.hasImage && wp.element.createElement(
					'div',
					{ className: 'image' },
					wp.element.createElement('img', { src: item.src, alt: item.alt })
				),
				wp.element.createElement(
					'div',
					{ 'class': 'text' },
					states.hasTitle && wp.element.createElement(
						'h3',
						null,
						item.title
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
			{ className: classes, 'data-slick': slick },
			rtn
		);
	}
});
