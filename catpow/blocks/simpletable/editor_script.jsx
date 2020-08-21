﻿registerBlockType('catpow/simpletable',{
	title: '🐾 SimpleTable',
	description:'見出しと本文の２列で構成されるシンプルなテーブルです。',
	icon: 'editor-table',
	category: 'catpow',
	
	transforms:{
		from: [
			{
				type:'block',
				blocks:CP.tableConvertibles,
				isMatch: function(attributes){
					return attributes.rows[0].cells.length===2;
				},
				transform:(attributes)=>{
					attributes.classes="wp-block-catpow-simpletable spec";
					return createBlock('catpow/simpletable',attributes);
				}
			}
		]
	},
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-simpletable spec'},
		rows:{
			source:'query',
			selector:'table tr',
			query:{
				classes:{source:'attribute',attribute:'class'},
				cond:{source:'attribute',attribute:'data-refine-cond'},
				cells:{
					source:'query',
					selector:'th,td',
					query:{
						text:{source:'children'},
						classes:{source:'attribute',attribute:'class'},
						style:{source:'attribute',attribute:'style'}
					}
				}
			},
			default:[
				{classes:'',cells:[
					{text:['Title'],classes:''},
					{text:['Content'],classes:''}
				]},
				{classes:'',cells:[
					{text:['Title'],classes:''},
					{text:['Content'],classes:''}
				]},
				{classes:'',cells:[
					{text:['Title'],classes:''},
					{text:['Content'],classes:''}
				]}
			]
		},
		blockState:{type:'object',default:{enableBlockFormat:true}}
	},
	example:CP.example,
	edit({attributes,className,setAttributes,isSelected}){
		const {classes,rows}=attributes;
		
		var selectiveClasses=[
			{
				label:'タイプ',
				filter:'type',
				values:['spec','info','history','inputs'],
				item:{
					spec:[
						{label:'種別',values:{
							normal:'なし',
							important:'重要',
							caution:'注意'
						}}
					],
					inputs:[
						{label:'種別',values:{
							normal:'なし',
							required:'必須',
							optional:'任意',
							readonly:'固定'
						}},
						'cond'
					]
				}
			}
		];
		
		const saveItems=()=>{
			setAttributes({rows:JSON.parse(JSON.stringify(rows))});
		}
		
		;
		return [
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
					filters={CP.filters.simpletable || {}}
				/>
				<SelectItemClassPanel
					title='行'
					icon='edit'
					set={setAttributes}
					attr={attributes}
					items={rows}
					index={attributes.currentItemIndex}
					triggerClasses={selectiveClasses[0]}
					filters={CP.filters.simpletable || {}}
				/>
				<ItemControlInfoPanel/>
			</InspectorControls>,
			<table className={classes}>
				<tbody>
				{rows.map((row,index)=>{
					return (
						<Item
							tag='tr'
							set={setAttributes}
							attr={attributes}
							items={rows}
							itemskey='rows'
							index={index}
							isSelected={isSelected}
						>
							<th>
								<RichText
									onChange={(text)=>{row.cells[0].text=text;saveItems();}}
									value={row.cells[0].text}
								/>
							</th>
							<td>
								<RichText
									onChange={(text)=>{row.cells[1].text=text;saveItems();}}
									value={row.cells[1].text}
								/>
							</td>
						</Item>
					);
				})}
				</tbody>
			</table>
		];
    },

	save({attributes,className}){
		const {classes,rows}=attributes
		return (
			<table className={classes}>
				<tbody>
				{rows.map((row,index)=>{
					return (
						<tr className={row.classes} data-refine-cond={row.cond}>
							<th className={row.cells[0].classes}>{row.cells[0].text}</th>
							<td className={row.cells[1].classes}>{row.cells[1].text}</td>
						</tr>
					);
				})}
				</tbody>
			</table>
		);
	}
});