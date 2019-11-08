registerBlockType('catpow/datatable', {
	title: '🐾 DataTable',
	icon: 'editor-table',
	category: 'catpow',

	attributes: {
		classes: { source: 'attribute', selector: 'table', attribute: 'class', default: 'wp-block-catpow-datatable spec hasHeaderRow hasHeaderColumn' },
		headerRow: {
			source: 'query',
			selector: 'table thead tr',
			query: {
				th: {
					source: 'query',
					selector: 'th',
					query: { text: { source: 'children' } }
				}
			},
			default: [{ classes: '', th: [{ text: ['Title'] }, { text: ['Title'] }, { text: ['Title'] }] }]
		},
		items: {
			source: 'query',
			selector: 'table tbody tr',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				th: {
					source: 'query',
					selector: 'th',
					query: { text: { source: 'children' } }
				},
				td: {
					source: 'query',
					selector: 'td',
					query: { text: { source: 'children' } }
				}
			},
			default: [{ classes: '', th: [{ text: ['Title'] }], td: [{ text: ['Content'] }, { text: ['Content'] }, { text: ['Content'] }] }, { classes: '', th: [{ text: ['Title'] }], td: [{ text: ['Content'] }, { text: ['Content'] }, { text: ['Content'] }] }, { classes: '', th: [{ text: ['Title'] }], td: [{ text: ['Content'] }, { text: ['Content'] }, { text: ['Content'] }] }]
		}
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes,
		    isSelected = _ref.isSelected;
		var classes = attributes.classes,
		    headerRow = attributes.headerRow,
		    items = attributes.items;

		var primaryClass = 'wp-block-catpow-datatable';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		var states = {
			hasHeaderRow: false,
			hasHeaderColumn: false
		};

		var statesClasses = [{ label: 'ヘッダ行', values: 'hasHeaderRow' }, { label: 'ヘッダ列', values: 'hasHeaderColumn' }];
		var selectiveClasses = [{ label: 'タイプ', values: ['spec', 'sheet', 'plan'] }, 'color'];

		var rtn = [];
		var headerRowCopy = headerRow.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});
		var itemsCopy = items.map(function (obj) {
			return jQuery.extend(true, {}, obj);
		});

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		var colUnitIndex = [];
		var rowUnitIndex = [];
		if (states.hasHeaderRow && headerRow.length == 0) {
			headerRow.push({ th: [] });
			for (var i = 0; i < items[0].td.length; i++) {
				headerRow[0].th.push({ text: ['Title'] });
			}
		}

		itemsCopy.map(function (item, index) {
			if (states.hasHeaderColumn && item.th.length === 0) {
				item.th = { text: ['Title'] };
			}
		});

		var saveItems = function saveItems() {
			setAttributes({ headerRow: headerRowCopy, items: itemsCopy });
		};

		var addRow = function addRow(index) {
			itemsCopy.splice(index, 0, itemsCopy[index]);
			saveItems();
		};
		var deleteRow = function deleteRow(index) {
			itemsCopy.splice(index, 1);
			saveItems();
		};
		var upRow = function upRow(index) {
			itemsCopy.splice(index + 1, 0, itemsCopy.splice(index, 1)[0]);
			saveItems();
		};
		var downRow = function downRow(index) {
			itemsCopy.splice(index - 1, 0, itemsCopy.splice(index, 1)[0]);
			saveItems();
		};

		var addColumn = function addColumn(index) {
			headerRowCopy.map(function (row) {
				return row.th.splice(index, 0, row.th[index]);
			});
			itemsCopy.map(function (item) {
				return item.td.splice(index, 0, item.td[index]);
			});
			saveItems();
		};
		var deleteColumn = function deleteColumn(index) {
			headerRowCopy.map(function (row) {
				return row.th.splice(index, 1);
			});
			itemsCopy.map(function (item) {
				return item.td.splice(index, 1);
			});
			saveItems();
		};
		var upColumn = function upColumn(index) {
			headerRowCopy.map(function (row) {
				row.th.splice(index + 1, 0, row.th.splice(index, 1)[0]);
			});
			itemsCopy.map(function (item) {
				item.td.splice(index + 1, 0, item.td.splice(index, 1)[0]);
			});
			saveItems();
		};
		var downColumn = function downColumn(index) {
			headerRowCopy.map(function (row) {
				row.th.splice(index - 1, 0, row.th.splice(index, 1)[0]);
			});
			itemsCopy.map(function (item) {
				item.td.splice(index - 1, 0, item.td.splice(index, 1)[0]);
			});
			saveItems();
		};

		return [wp.element.createElement(
			'table',
			{ className: classes },
			states.hasHeaderRow && wp.element.createElement(
				'thead',
				null,
				headerRowCopy.map(function (row, index) {
					return wp.element.createElement(
						'tr',
						null,
						states.hasHeaderColumn && wp.element.createElement('td', { className: 'spacer' }),
						row.th.map(function (th, index) {
							return wp.element.createElement(
								'th',
								null,
								wp.element.createElement(RichText, { onChange: function onChange(text) {
										th.text = text;saveItems();
									}, value: th.text })
							);
						})
					);
				})
			),
			wp.element.createElement(
				'tbody',
				null,
				itemsCopy.map(function (item, index) {
					return wp.element.createElement(
						'tr',
						null,
						states.hasHeaderColumn && item.th.map(function (th, columnIndex) {
							return wp.element.createElement(
								'th',
								null,
								wp.element.createElement(RichText, { onChange: function onChange(text) {
										th.text = text;saveItems();
									}, value: th.text })
							);
						}),
						item.td.map(function (td, columnIndex) {
							return wp.element.createElement(
								'td',
								null,
								wp.element.createElement(RichText, { onChange: function onChange(text) {
										td.text = text;saveItems();
									}, value: td.text }),
								isSelected && columnIndex == item.td.length - 1 && wp.element.createElement(
									'div',
									{ 'class': 'itemControl rowControl' },
									wp.element.createElement('div', { className: 'btn up', onClick: function onClick() {
											return downRow(index);
										} }),
									wp.element.createElement('div', { className: 'btn delete', onClick: function onClick() {
											return deleteRow(index);
										} }),
									wp.element.createElement('div', { className: 'btn clone', onClick: function onClick() {
											return addRow(index);
										} }),
									wp.element.createElement('div', { className: 'btn down', onClick: function onClick() {
											return upRow(index);
										} })
								),
								isSelected && index == itemsCopy.length - 1 && wp.element.createElement(
									'div',
									{ 'class': 'itemControl columnControl' },
									wp.element.createElement('div', { className: 'btn left', onClick: function onClick() {
											return downColumn(columnIndex);
										} }),
									wp.element.createElement('div', { className: 'btn delete', onClick: function onClick() {
											return deleteColumn(columnIndex);
										} }),
									wp.element.createElement('div', { className: 'btn clone', onClick: function onClick() {
											return addColumn(columnIndex);
										} }),
									wp.element.createElement('div', { className: 'btn right', onClick: function onClick() {
											return upColumn(columnIndex);
										} })
								)
							);
						})
					);
				})
			)
		), wp.element.createElement(
			InspectorControls,
			null,
			wp.element.createElement(SelectClassPanel, {
				title: '\u8868\u793A\u8A2D\u5B9A',
				icon: 'admin-appearance',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: statesClasses
			}),
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses
			}),
			wp.element.createElement(ImporterCSVPanel, {
				title: 'CSV\u8AAD\u307F\u8FBC\u307F',
				icon: 'format-aside',
				callback: function callback(csv) {
					console.log(csv);
				}
			})
		)];
	},
	save: function save(_ref2) {
		var attributes = _ref2.attributes,
		    className = _ref2.className;
		var classes = attributes.classes,
		    headerRow = attributes.headerRow,
		    items = attributes.items;

		var classArray = classes.split(' ');

		var states = {
			hasHeaderRow: false,
			hasHeaderColumn: false
		};

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		return wp.element.createElement(
			'table',
			{ className: classes },
			states.hasHeaderRow && wp.element.createElement(
				'thead',
				null,
				headerRow.map(function (row, index) {
					return wp.element.createElement(
						'tr',
						null,
						states.hasHeaderColumn && wp.element.createElement('td', { className: 'spacer' }),
						row.th.map(function (th, columnIndex) {
							return wp.element.createElement(
								'th',
								null,
								th.text
							);
						})
					);
				})
			),
			wp.element.createElement(
				'tbody',
				null,
				items.map(function (row, index) {
					return wp.element.createElement(
						'tr',
						null,
						states.hasHeaderColumn && row.th.map(function (th, columnIndex) {
							return wp.element.createElement(
								'th',
								null,
								th.text
							);
						}),
						row.td.map(function (td, columnIndex) {
							return wp.element.createElement(
								'td',
								null,
								td.text
							);
						})
					);
				})
			)
		);
	}
});
