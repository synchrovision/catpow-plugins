registerBlockType('catpow/simpletable',{
	title: '🐾 SimpleTable',
	icon: 'editor-table',
	category: 'catpow',
	
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-simpletable spec'},
		items:{
			source:'query',
			selector:'table tr',
			query:{
				classes:{source:'attribute',attribute:'class'},
				cond:{source:'attribute',attribute:'data-refine-cond'},
				th:{source:'children',selector:'th'},
				td:{source:'children',selector:'td'},
			},
			default:[
				{th:['Title'],td:['Content']},
				{th:['Title'],td:['Content']},
				{th:['Title'],td:['Content']}
			]
		}
	},
	edit({attributes,className,setAttributes}){
		const {classes,items}=attributes;
		
		var selectiveClasses=[
			{
				label:'タイプ',
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
		
		let rtn=[];
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		itemsCopy.map((item,index)=>{
			rtn.push(
				<Item
					tag='tr'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={index}
				>
					<th>
						<RichText
                            onChange={(th)=>{itemsCopy[index].th=th;setAttributes({items:itemsCopy});}}
                            value={item.th}
                        />
					</th>
					<td>
						<RichText
                            onChange={(td)=>{itemsCopy[index].td=td;setAttributes({items:itemsCopy});}}
                            value={item.td}
                        />
					</td>
				</Item>
			);
		});
		return [
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<SelectItemClassPanel
					title='行'
					icon='edit'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={attributes.currentItemIndex}
					triggerClasses={selectiveClasses[0]}
				/>
				<ItemControlInfoPanel/>
			</InspectorControls>,
			<table className={classes}><tbody>{rtn}</tbody></table>
		];
    },

	save({attributes,className}){
		const {classes,items}=attributes
		let rtn=[];
		items.map((item,index)=>{
			rtn.push(
				<tr className={item.classes} data-refine-cond={item.cond}><th>{item.th}</th><td>{item.td}</td></tr>
			);
		});
		return <table className={classes}><tbody>{rtn}</tbody></table>;
	}
});