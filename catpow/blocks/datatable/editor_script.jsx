registerBlockType('catpow/datatable',{
	title: '🐾 DataTable',
	icon: 'editor-table',
	category: 'catpow',
	
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-datatable spec hasHeaderRow hasHeaderColumn'},
		headerRow:{
			source:'query',
			selector:'table thead tr',
			query:{
				th:{
					source:'query',
					selector:'th',
					query:{text:{source:'children'}}
				}
			},
			default:[
				{classes:'',th:[{text:['Title']},{text:['Title']},{text:['Title']}]}
			]
		},
		items:{
			source:'query',
			selector:'table tbody tr',
			query:{
				classes:{source:'attribute',attribute:'class'},
				th:{
					source:'query',
					selector:'th',
					query:{text:{source:'children'}}
				},
				td:{
					source:'query',
					selector:'td',
					query:{text:{source:'children'}}
				},
			},
			default:[
				{classes:'',th:[{text:['Title']}],td:[{text:['Content']},{text:['Content']},{text:['Content']}]},
				{classes:'',th:[{text:['Title']}],td:[{text:['Content']},{text:['Content']},{text:['Content']}]},
				{classes:'',th:[{text:['Title']}],td:[{text:['Content']},{text:['Content']},{text:['Content']}]}
			]
		}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {classes,headerRow,items}=attributes;
		const primaryClass='wp-block-catpow-datatable';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
		var states={
			hasHeaderRow:false,
			hasHeaderColumn:false,
		}
		
		var statesClasses=[
			{label:'ヘッダ行',values:'hasHeaderRow'},
			{label:'ヘッダ列',values:'hasHeaderColumn'},
		];
		var selectiveClasses=[
			{label:'タイプ',values:['spec','sheet','plan']},
			'color'
		];
		
		
		let rtn=[];
		let headerRowCopy=headerRow.map((obj)=>jQuery.extend(true,{},obj));
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		let colUnitIndex=[];
		let rowUnitIndex=[];
		if(states.hasHeaderRow && headerRow.length==0){
			headerRow.push({th:[]});
			for(let i=0;i<items[0].td.length;i++){
				headerRow[0].th.push({text:['Title']});
			}
		}
		
		itemsCopy.map((item,index)=>{
			if(states.hasHeaderColumn && item.th.length===0){item.th={text:['Title']};}
		});
		
		
		const saveItems=()=>{
			setAttributes({headerRow:headerRowCopy,items:itemsCopy});
		}
		
		const addRow=(index)=>{
            itemsCopy.splice(index,0,itemsCopy[index]);
            saveItems();
        }
		const deleteRow=(index)=>{
            itemsCopy.splice(index,1);
            saveItems();
        }
		const upRow=(index)=>{
            itemsCopy.splice(index+1,0,itemsCopy.splice(index,1)[0]);
            saveItems();
        }
		const downRow=(index)=>{
            itemsCopy.splice(index-1,0,itemsCopy.splice(index,1)[0]);
            saveItems();
        }
		
		const addColumn=(index)=>{
            headerRowCopy.map((row)=>row.th.splice(index,0,row.th[index]));
            itemsCopy.map((item)=>item.td.splice(index,0,item.td[index]));
            saveItems();
        }
		const deleteColumn=(index)=>{
            headerRowCopy.map((row)=>row.th.splice(index,1));
            itemsCopy.map((item)=>item.td.splice(index,1));
            saveItems();
        }
		const upColumn=(index)=>{
            headerRowCopy.map((row)=>{row.th.splice(index+1,0,row.th.splice(index,1)[0])});
            itemsCopy.map((item)=>{item.td.splice(index+1,0,item.td.splice(index,1)[0])});
            saveItems();
        }
		const downColumn=(index)=>{
            headerRowCopy.map((row)=>{row.th.splice(index-1,0,row.th.splice(index,1)[0])});
            itemsCopy.map((item)=>{item.td.splice(index-1,0,item.td.splice(index,1)[0])});
            saveItems();
        }
		
		
		
		return [
			<table className={classes}>
				{states.hasHeaderRow && 
					<thead>
						{headerRowCopy.map((row,index)=>{
							return <tr>
								{states.hasHeaderColumn && <td className="spacer"></td>}
								{row.th.map((th,index)=>{
									return <th><RichText onChange={(text)=>{th.text=text;saveItems();}} value={th.text}/></th>
								})}
							</tr>
						})}
					</thead>
				}
				<tbody>
                    {itemsCopy.map((item,index)=>{
                        return <tr>
                            {states.hasHeaderColumn && item.th.map((th,columnIndex)=>{
								return <th>
									<RichText onChange={(text)=>{th.text=text;saveItems();}} value={th.text}/>
								</th>
                            })}
                            {item.td.map((td,columnIndex)=>{
                                return <td>
                                    <RichText onChange={(text)=>{td.text=text;saveItems();}} value={td.text}/>
									{isSelected && (columnIndex == item.td.length-1) && 
										<div class="itemControl rowControl">
											<div className='btn up' onClick={()=>downRow(index)}></div>
											<div className='btn delete' onClick={()=>deleteRow(index)}></div>
											<div className='btn clone' onClick={()=>addRow(index)}></div>
											<div className='btn down' onClick={()=>upRow(index)}></div>
										</div>
									}
									{isSelected && (index == itemsCopy.length-1) && 
										<div class="itemControl columnControl">
											<div className='btn left' onClick={()=>downColumn(columnIndex)}></div>
											<div className='btn delete' onClick={()=>deleteColumn(columnIndex)}></div>
											<div className='btn clone' onClick={()=>addColumn(columnIndex)}></div>
											<div className='btn right' onClick={()=>upColumn(columnIndex)}></div>
										</div>
									}
                                </td>
                            })}
                        </tr>
                    })}
                </tbody>
			</table>,
			<InspectorControls>
				<SelectClassPanel
					title='表示設定'
					icon='admin-appearance'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={statesClasses}
				/>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<ImporterCSVPanel
					title='CSV読み込み'
					icon='format-aside'
					callback={(csv)=>{
						console.log(csv);
					}}
				/>
			</InspectorControls>
		];
    },

	save({attributes,className}){
		const {classes,headerRow,items}=attributes;
		var classArray=classes.split(' ');
		
		
		var states={
			hasHeaderRow:false,
			hasHeaderColumn:false,
		}
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		return <table className={classes}>
			{states.hasHeaderRow && 
				<thead>{
					headerRow.map((row,index)=>{
						return <tr>
							{states.hasHeaderColumn && <td className="spacer"></td>}
							{row.th.map((th,columnIndex)=>{return <th>{th.text}</th>})}
						</tr>
					})
				}</thead>
			}
			<tbody>{
				items.map((row,index)=>{
					return <tr>
						{states.hasHeaderColumn && row.th.map((th,columnIndex)=>{return <th>{th.text}</th>})}
						{row.td.map((td,columnIndex)=>{return <td>{td.text}</td>})}
					</tr>
				})
			}</tbody>
		</table>;
	}
});