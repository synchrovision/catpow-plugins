/**
* @todo BlockVerticalAlignmentToolbarが実装されたら対応
*/
registerBlockType('catpow/layouttable',{
	title: '🐾 LayoutTable',
	icon: 'editor-table',
	category: 'catpow',
	
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-layouttable spec'},
		rows:{
			source:'query',
			selector:'table tr',
			query:{
				classes:{source:'attribute',attribute:'class'},
				cells:{
					source:'query',
					selector:'th,td',
					query:{
						text:{source:'children'},
						classes:{source:'attribute',attribute:'class'},
						rowspan:{source:'attribute',attribute:'rowspan'},
						colspan:{source:'attribute',attribute:'colspan'}
					}
				}
			},
			default:[
				{classes:'',cells:[
					{text:['Title'],classes:'th'},
					{text:['Title'],classes:'th'},
					{text:['Title'],classes:'th'}
				]},
				{classes:'',cells:[
					{text:['Content'],classes:''},
					{text:['Content'],classes:''},
					{text:['Content'],classes:''}
				]},
				{classes:'',cells:[
					{text:['Content'],classes:''},
					{text:['Content'],classes:''},
					{text:['Content'],classes:''}
				]}
			]
		}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {classes,rows}=attributes;
		const primaryClass='wp-block-catpow-layouttable';
		
		var selectiveClasses=[
			{label:'タイプ',values:['spec','sheet','plan']}
		];
		
		var rtn=[];
		
		var rowLen=rows.length;
		var colLen=0;
		rows[0].cells.map((cell)=>{colLen+=parseInt(cell.colspan?cell.colspan:1);});
		var rowsCopy=rows.map((row,r)=>{return {classes:row.classes,cells:new Array(colLen)}});
		
		var selectedCells=[];
		
		rows.map((row,r)=>{
			let c=0;
			row.cells.map((cell)=>{
				while(c in rowsCopy[r].cells){c++;}
				cell.r=r;
				cell.c=c;
				var cellCopy=jQuery.extend(true,{},cell);
				if(cell.rowspan > 1  || cell.colspan > 1){
					let arias={mergedTo:cellCopy};
					rowsCopy.slice(r,r+parseInt(cell.rowspan?cell.rowspan:1)).map((row)=>{
						row.cells.fill(arias,c,c+parseInt(cell.colspan?cell.colspan:1));
					});
				}
				rowsCopy[r].cells[c]=cellCopy;
				if(cellCopy.isSelected){selectedCells.push(cellCopy);}
			});
		});
	
		const saverows=()=>{
			setAttributes({rows:rowsCopy.map((row)=>{
				row.cells=row.cells.filter((cell)=>!cell.mergedTo);
				return row;
			})});
		}
		
		const addRow=(r)=>{
            rowsCopy.splice(r,0,rowsCopy[r]);
            saverows();
        }
		const deleteRow=(r)=>{
            rowsCopy.splice(r,1);
            saverows();
        }
		const upRow=(r)=>{
			if(r<0 || r>=rowLen-1){return;}
            rowsCopy.splice(r+1,0,rowsCopy.splice(r,1)[0]);
			var r1=rowsCopy[r].cells;
			var r2=rowsCopy[r+1].cells;
			for(var c=0;c<colLen;c++){
				if(
					(r1[c].mergedTo && r1[c].mergedTo.rowspan > 1) || 
					r1[c].rowspan > 1 || 
					(r2[c].mergedTo && r2[c].mergedTo.rowspan > 1) || 
					r2[c].rowspan > 1
				){
					console.log(c);
					r1.splice(c,0,r2.splice(c,1)[0]);
					r2.splice(c,0,r1.splice(c+1,1)[0]);
				}
			}
            saverows();
        }
		const downRow=(r)=>{upRow(r-1);}
		
		const addColumn=(c)=>{
			let done=[];
            rowsCopy.map((row,r)=>{
				if(row.cells[c].colspan > 1){
					done.push(row.cells[c]);
					row.cells[c].colspan++;
					row.cells.splice(c,0,row.cells[c+1]);
				}
				else{
					if(row.cells[c].mergedTo && !done.includes(row.cells[c].mergedTo)){
						done.push(row.cells[c].mergedTo);
						if(row.cells[c].mergedTo.colspan > 1){
							row.cells[c].mergedTo.colspan++;
						}
					}
					row.cells.splice(c,0,row.cells[c]);
				}
			});
            saverows();
        }
		const deleteColumn=(c)=>{
			let done=[];
            rowsCopy.map((row,r)=>{
				if(row.cells[c].colspan > 1){
					done.push(row.cells[c]);
					row.cells[c].colspan--;
					row.cells[c+1]=row.cells[c];
				}
				else if(row.cells[c].mergedTo && !done.includes(row.cells[c].mergedTo)){
					done.push(row.cells[c].mergedTo);
					if(row.cells[c].mergedTo.colspan > 1){
						row.cells[c].mergedTo.colspan--;
					}
				}
			});
            rowsCopy.map((row)=>row.cells.splice(c,1));
            saverows();
        }
		const upColumn=(c)=>{
			if(c<0 || c>=colLen-1){return;}
            rowsCopy.map((row)=>{
				if(
					(row.cells[c].mergedTo && row.cells[c].mergedTo.colspan > 1) ||
					row.cells[c].colspan > 1 ||
					(row.cells[c+1].mergedTo && row.cells[c+1].mergedTo.colspan > 1) ||
					row.cells[c+1].colspan > 1
				){return;}
				row.cells.splice(c+1,0,row.cells.splice(c,1)[0]);
			});
            saverows();
        }
		const downColumn=(c)=>{upColumn(c-1);}
		
		const selectCells=(e,r,c)=>{
			if(e.metaKey){rowsCopy[r].cells[c].isSelected=!rowsCopy[r].cells[c].isSelected;}
			else if(e.shiftKey){
				let org,l=false;
				rowsCopy.map((row,tr)=>{
					row.cells.map((cell,tc)=>{
						if(cell.isSelected){
							if(!org || l>Math.abs(tr-r)+Math.abs(tc-c)){
								l=Math.abs(tr-r)+Math.abs(tc-c);
								org=[tr,tc];
							}
						}
					});
				});
				if(org){
					for(var crrR=Math.min(org[0],r);crrR<=Math.max(org[0],r);crrR++){
						for(var crrC=Math.min(org[1],c);crrC<=Math.max(org[1],c);crrC++){
							if(rowsCopy[crrR].cells[crrC].mergedTo)continue;
							rowsCopy[crrR].cells[crrC].isSelected=true;
						}
					}
				}
				else{
					rowsCopy[r].cells[c].isSelected=true;
				}
			}
			else{unselectAllCells();rowsCopy[r].cells[c].isSelected=true;}
			saverows();
		}
		const unselectAllCells=()=>{
			selectedCells.map((cell)=>cell.isSelected=false);
		}
		
		const setCellClasses=(values,value)=>{
			if(!Array.isArray(values) && _.isObject(values)){values=Object.keys(values);}
			
            selectedCells.map((cell)=>{
				let classArray=cell.classes.split(' ');
				classArray=_.difference(classArray,values);
				if(Array.isArray(value)){classArray=classArray.concat(value);}
				else{classArray.push(value);}
				cell.classes=classArray.join(' ');
			});
							
			saverows();
		}
		const addCellClasses=(values)=>{
			if(!Array.isArray(values)){values=[values];}
            selectedCells.map((cell)=>{
				let classArray=cell.classes?cell.classes.split(' '):[];
				classArray=_.difference(classArray,values);
				classArray=classArray.concat(values);
				cell.classes=classArray.join(' ')
			});
			saverows();
		}
		const removeCellClasses=(values)=>{
			if(!Array.isArray(values)){values=[values];}
            selectedCells.map((cell)=>{
				let classArray=cell.classes?cell.classes.split(' '):[];
				classArray=_.difference(classArray,values);
				cell.classes=classArray.join(' ')
			});
			saverows();
		}
		const getCellClasses=()=>{
			if(!selectedCells[0] || !selectedCells[0].classes){return [];}
			var rtn=selectedCells[0].classes.split(' ');
			for(var i=1;i<selectedCells.length;i++){
				if(rtn.length<1){return [];}
				if(!selectedCells[i].classes){return [];}
				rtn=_.intersection(rtn,selectedCells[i].classes.split(' '));
			}
			return rtn;
		}
		const isRectSelection=()=>{
			if(selectedCells.length<2){return false;}
			var from=selectedCells[0];
			var to=selectedCells[selectedCells.length-1];
			
			var fromC=from.c;
			var toR=to.r;
			var toC=to.c;
			if(to.rowlspan > 1){toR+=to.rowspan-1;}
			if(to.colspan > 1){toC+=to.colspan-1;}
			
			return selectedCells.every((cell)=>{
				if(cell.c < fromC || cell.c > toC){return false;}
				if(cell.rowspan > 1 && cell.r+cell.rowspan-1 > toR){return false;}
				if(cell.colspan > 1 && cell.c+cell.colspan-1 > toC){return false;}
				return true;
			});
		}
		const isMergedCellSelected=()=>{
			return selectedCells.some((cell)=>(cell.rowspan > 1 || cell.colspan > 1));
		}
		
		const mergeCells=()=>{
			var from=selectedCells[0];
			var to=selectedCells[selectedCells.length-1];
			
			var text=[];
			selectedCells.map((cell)=>{
				text=text.concat(cell.text);
			});
			from.text=text;
			
			let arias={mergedTo:from};
			rowsCopy.slice(from.r,to.r+1).map((row)=>{
				row.cells.fill(arias,from.c,to.c+1);
			});
			from.rowspan=to.r-from.r+1;
			from.colspan=to.c-from.c+1;
			
			rowsCopy[from.r].cells[from.c]=from;
			saverows();
		}
		const breakCells=()=>{
			selectedCells.map((cell)=>{
				let r=cell.r;
				let c=cell.c;
				if(cell.rowspan > 1  || cell.colspan > 1){
					var cellCopy=jQuery.extend(true,{},cell);
					cellCopy.text=[];
					cellCopy.rowspan=cellCopy.colspan=false;
					rowsCopy.slice(r,r+parseInt(cell.rowspan?cell.rowspan:1)).map((row)=>{
						row.cells.fill(cellCopy,c,c+parseInt(cell.colspan?cell.colspan:1));
					});
					cell.rowspan=cell.colspan=false;
				}
				rowsCopy[r].cells[c]=cell;
			});
			
			saverows();
		}
		
		var cellClasses=getCellClasses();
		
		const selectCellClasses=(label,values)=>{
			var options,value;
			if(Array.isArray(values)){
				options=values.map(cls=>{return {label:cls,value:cls};});
			}
			else{
				options=Object.keys(values).map((cls)=>{return {label:values[cls],value:cls};});
				values=Object.keys(values);
			}
			value=_.intersection(cellClasses,values).shift();
			if(!value){value='default';}
			
			return (
				<SelectControl
					label={label}
					onChange={(input)=>{
						if(input=='default'){removeCellClasses(values);}
						else{setCellClasses(values,input);}
					}}
					value={value}
					options={options}
				/>
			);
		}
		
		const aligns=['left','center','right'];
		const valigns=['top','center','bottom'];
		
		return [
			<BlockControls>
				<AlignmentToolbar
					value={_.intersection(cellClasses,aligns).shift()}
					onChange={(value)=>{
						if(value){setCellClasses(aligns,value);}
						else{removeCellClasses(aligns);}
					}}
				/>
			</BlockControls>,
			<table className={classes}>
				<tbody>
                    {rowsCopy.map((row,r)=>{
                        return <tr>
                            {row.cells.map((cell,c)=>{
								if(cell.mergedTo){return false;}
                                return el(
									(cell.classes && cell.classes.split(' ').includes('th'))?'th':'td',
									{
										className:cell.classes,
										rowspan:cell.rowspan,
										colspan:cell.colspan,
										onClick:(e)=>selectCells(e,r,c)
									},
									<Fragment>
										<RichText onChange={(text)=>{cell.text=text;saverows();}} value={cell.text}/>
										{isSelected && (c == colLen-parseInt(cell.colspan?cell.colspan:1)) && 
											<div class="itemControl rowControl">
												<div className='btn up' onClick={()=>downRow(r)}></div>
												<div className='btn delete' onClick={()=>deleteRow(r)}></div>
												<div className='btn clone' onClick={()=>addRow(r)}></div>
												<div className='btn down' onClick={()=>upRow(r)}></div>
											</div>
										}
										{isSelected && (r == rowLen-parseInt(cell.rowspan?cell.rowspan:1)) && 
											<div class="itemControl columnControl">
												<div className='btn left' onClick={()=>downColumn(c)}></div>
												<div className='btn delete' onClick={()=>deleteColumn(c)}></div>
												<div className='btn clone' onClick={()=>addColumn(c)}></div>
												<div className='btn right' onClick={()=>upColumn(c)}></div>
											</div>
										}
										{isSelected && cell.isSelected && <div className="selectBox"></div>}
									</Fragment>
								);
                            })}
                        </tr>
                    })}
                </tbody>
			</table>,
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<PanelBody title="セル">
                    <CheckboxControl
                        label={'見出し'}
                        onChange={(input)=>{
							if(input){addCellClasses('th');}
							else{removeCellClasses('th');}
						}}
                        checked={cellClasses.includes('th')}
                    />
					{selectCellClasses('カラー',{
						'default':'なし','primary':"推奨",'deprecated':"非推奨",'danger':"危険",'caution':"注意",'safe':"安全"
					})}
					{selectCellClasses('文字',{
						'default':'なし','large':"大",'medium':"中",'small':"小"
					})}
					{isRectSelection() && 
						<Button isDefault onClick={()=>mergeCells()}>セルを結合</Button>
					}
					{selectedCells.some((cell)=>(cell.rowspan > 1 || cell.colspan > 1)) &&
						<Button isDefault onClick={()=>breakCells()}>結合を解除</Button>
					}
				</PanelBody>
			</InspectorControls>
		];
    },

	save({attributes,className}){
		const {classes,rows}=attributes;
		
		return <table className={classes}>
			<tbody>{
				rows.map((row)=>{
					return <tr>
						 {row.cells.map((cell)=>{
							return el(
								(cell.classes && cell.classes.split(' ').includes('th'))?'th':'td',
								{className:cell.classes,rowspan:cell.rowspan,colspan:cell.colspan},
								cell.text
							);
						})}
					</tr>
				})
			}</tbody>
		</table>;
	}
});