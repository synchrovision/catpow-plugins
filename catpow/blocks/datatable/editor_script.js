registerBlockType('catpow/datatable', {
	title: '🐾 DataTable',
	icon: 'editor-table',
	category: 'catpow',

	transforms: {
		from: [{
			type: 'files',
			isMatch: function isMatch(files) {
				if (files[1]) {
					return false;
				}
				return files[0].type === 'text/csv';
			},
			priority: 10,
			transform: function transform(files) {
				var attributes = {
					classes: 'wp-block-catpow-datatable spec',
					rows: [{ classes: '', cells: [{ text: ['Title'], classes: 'th' }] }],
					file: files[0]
				};
				return createBlock('catpow/datatable', attributes);
			}
		}, {
			type: 'block',
			blocks: CP.tableConvertibles,
			transform: function transform(attributes) {
				attributes.classes = "wp-block-catpow-datatable spec";
				return createBlock('catpow/datatable', attributes);
			}
		}, {
			type: 'block',
			blocks: ['core/table'],
			transform: function transform(attributes) {
				return createBlock('catpow/datatable', {
					classes: "wp-block-catpow-datatable spec",
					rows: attributes.body.map(function (row) {
						return {
							cells: row.cells.map(function (cell) {
								return {
									text: wp.blocks.parseWithAttributeSchema(cell.content, { source: 'children' })
								};
							})
						};
					})
				});
			}
		}]
	},
	attributes: {
		classes: { source: 'attribute', selector: 'table', attribute: 'class', default: 'wp-block-catpow-datatable spec hasHeaderRow hasHeaderColumn' },

		rows: {
			source: 'query',
			selector: 'table tr',
			query: {
				classes: { source: 'attribute', attribute: 'class' },
				cells: {
					source: 'query',
					selector: 'th,td',
					query: {
						text: { source: 'children' },
						classes: { source: 'attribute', attribute: 'class' },
						style: { source: 'attribute', attribute: 'style' }
					}
				}
			},
			default: [{ classes: '', cells: [{ text: [''], classes: 'spacer' }, { text: ['Title'], classes: '' }, { text: ['Title'], classes: '' }] }, { classes: '', cells: [{ text: ['Title'], classes: '' }, { text: ['Content'], classes: '' }, { text: ['Content'], classes: '' }] }, { classes: '', cells: [{ text: ['Title'], classes: '' }, { text: ['Content'], classes: '' }, { text: ['Content'], classes: '' }] }]
		},
		file: { type: 'object' },
		blockState: { type: 'object', default: { enableBlockFormat: true } }
	},
	edit: function edit(_ref) {
		var attributes = _ref.attributes,
		    className = _ref.className,
		    setAttributes = _ref.setAttributes,
		    isSelected = _ref.isSelected;
		var classes = attributes.classes,
		    rows = attributes.rows;

		var primaryClass = 'wp-block-catpow-datatable';
		var classArray = _.uniq((className + ' ' + classes).split(' '));
		var classNameArray = className.split(' ');

		console.log(wp.data.select('core/blocks').getBlockTypes());

		if (attributes.file) {
			var reader = new FileReader();
			reader.addEventListener('loadend', function () {
				var attr = {
					classes: 'wp-block-catpow-datatable spec hasHeaderRow hasHeaderColumn',
					rows: [],
					file: false
				};
				var csvData = CP.parseCSV(reader.result);
				csvData.map(function (row, r) {
					attr.rows.push({ classes: '', cells: row.map(function (val) {
							return { text: [val], classes: '' };
						}) });
				});
				setAttributes(attr);
			});
			reader.readAsText(attributes.file);
		}

		var states = {
			hasHeaderRow: false,
			hasHeaderColumn: false
		};

		var statesClasses = [{ label: 'ヘッダ行', values: 'hasHeaderRow' }, { label: 'ヘッダ列', values: 'hasHeaderColumn' }];
		var selectiveClasses = [{ label: 'タイプ', filter: 'type', values: ['spec', 'sheet', 'plan'] }, 'color'];

		var hasClass = function hasClass(cls) {
			return classArray.indexOf(cls) !== -1;
		};
		Object.keys(states).forEach(function (key) {
			this[key] = hasClass(key);
		}, states);

		var saveItems = function saveItems() {
			setAttributes({ rows: JSON.parse(JSON.stringify(rows)) });
		};

		var addRow = function addRow(index) {
			rows.splice(index, 0, rows[index]);
			saveItems();
		};
		var deleteRow = function deleteRow(index) {
			rows.splice(index, 1);
			saveItems();
		};
		var upRow = function upRow(index) {
			rows.splice(index + 1, 0, rows.splice(index, 1)[0]);
			saveItems();
		};
		var downRow = function downRow(index) {
			rows.splice(index - 1, 0, rows.splice(index, 1)[0]);
			saveItems();
		};

		var addColumn = function addColumn(index) {
			rows.map(function (row) {
				return row.cells.splice(index, 0, row.cells[index]);
			});
			saveItems();
		};
		var deleteColumn = function deleteColumn(index) {
			rows.map(function (row) {
				return row.cells.splice(index, 1);
			});
			saveItems();
		};
		var upColumn = function upColumn(index) {
			rows.map(function (row) {
				row.cells.splice(index + 1, 0, row.cells.splice(index, 1)[0]);
			});
			saveItems();
		};
		var downColumn = function downColumn(index) {
			rows.map(function (row) {
				row.cells.splice(index - 1, 0, row.cells.splice(index, 1)[0]);
			});
			saveItems();
		};

		return [wp.element.createElement(
			'table',
			{ className: classes },
			states.hasHeaderRow && wp.element.createElement(
				'thead',
				null,
				wp.element.createElement(
					'tr',
					null,
					rows[0].cells.map(function (cell, index) {
						if (index === 0) {
							if (states.hasHeaderColumn && cell.text.length === 0) {
								cell.classes = 'spacer';
							} else if (cell.classes == 'spacer') {
								cell.classes = '';
							}
						}
						return wp.element.createElement(
							'th',
							{ className: cell.classes },
							wp.element.createElement(RichText, { onChange: function onChange(text) {
									cell.text = text;saveItems();
								}, value: cell.text })
						);
					})
				)
			),
			wp.element.createElement(
				'tbody',
				null,
				rows.map(function (row, index) {
					if (states.hasHeaderRow && index == 0) {
						return false;
					}
					return wp.element.createElement(
						'tr',
						null,
						row.cells.map(function (cell, columnIndex) {
							var children = [wp.element.createElement(RichText, { onChange: function onChange(text) {
									cell.text = text;saveItems();
								}, value: cell.text })];
							if (isSelected && columnIndex == row.cells.length - 1) {
								children.push(wp.element.createElement(
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
								));
							}
							if (isSelected && index == rows.length - 1) {
								children.push(wp.element.createElement(
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
								));
							}
							return wp.element.createElement(states.hasHeaderColumn && columnIndex == 0 ? 'th' : 'td', { className: cell.classes }, children);
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
				selectiveClasses: statesClasses,
				filters: CP.filters.datatable || {}
			}),
			wp.element.createElement(SelectClassPanel, {
				title: '\u30AF\u30E9\u30B9',
				icon: 'art',
				set: setAttributes,
				attr: attributes,
				selectiveClasses: selectiveClasses,
				filters: CP.filters.datatable || {}
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
		    className = _ref2.className;
		var classes = attributes.classes,
		    rows = attributes.rows;

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
				wp.element.createElement(
					'tr',
					null,
					rows[0].cells.map(function (cell, index) {
						return wp.element.createElement(
							'th',
							{ className: cell.classes },
							cell.text
						);
					})
				)
			),
			wp.element.createElement(
				'tbody',
				null,
				rows.map(function (row, index) {
					if (states.hasHeaderRow && index == 0) {
						return false;
					}
					return wp.element.createElement(
						'tr',
						null,
						row.cells.map(function (cell, columnIndex) {
							return wp.element.createElement(states.hasHeaderColumn && columnIndex == 0 ? 'th' : 'td', { className: cell.classes }, cell.text);
						})
					);
				})
			)
		);
	}
});
