const CP={
	
	selectImage:(keys,set,size)=>{
		if(CP.uploder===undefined){
			CP.uploader=wp.media({
				title:'Select Image',
				button:{text:'Select'},  
				multiple:false
			});
		}
		CP.uploader.off('select').on('select',()=>{
			let image = CP.uploader.state().get('selection').first().toJSON();
			let data={};
			if(keys.mime){data[keys.mime]=image.mime;}
			if(size && image.sizes && image.sizes[size]){data[keys.src]=image.sizes[size].url;}
			else{data[keys.src]=image.url;}
			if(keys.alt){data[keys.alt]=image.alt;}
			if(keys.srcset && image.sizes){
				data[keys.srcset]=image.sizes.medium_large.url+' 480w,'+image.url;
			}
			set(data);
		}).open();
	},
	parseCSV:(csv)=>{
		let tmp=[];
		csv=csv.replace(/("[^"]*")+/g,(match)=>{
            tmp.push(match.slice(1,-1).replace(/""/g,'"'));return '[TMP]';
        });
		return csv.split("\n").map((row)=>{
            return row.split(',').map((val)=>val==='[TMP]'?tmp.shift():val)
        });
	},
	
	switchColor:({set,attr},value)=>{
		let classArray=attr.classes.split(' ');
		let i=classArray.findIndex(cls=>(cls.substr(0,5)==='color'));
		if(i===-1){if(value){classArray.push('color'+value);}}
		else{if(value){classArray.splice(i,1,'color'+value);}else{classArray.splice(i,1)}}
		set({classes:classArray.join(' ')});
	},
	getColor:({attr})=>{
		let value=attr.classes.split(' ').find(cls=>(cls.substr(0,5)==='color'));
		if(!value){return 0;}
		return parseInt(value.substr(5));
	},
	
	switchPattern:({set,attr},value)=>{
		let classArray=attr.classes.split(' ');
		let i=classArray.findIndex(cls=>(cls.substr(0,7)==='pattern'));
		if(i===-1){if(value){classArray.push('pattern'+value);}}
		else{if(value){classArray.splice(i,1,'pattern'+value);}else{classArray.splice(i,1)}}
		set({classes:classArray.join(' ')});
	},
	getPattern:({attr})=>{
		let value=attr.classes.split(' ').find(cls=>(cls.substr(0,7)==='pattern'));
		if(!value){return 0;}
		return parseInt(value.substr(7));
	},
	
	switchSelectiveClass:({set,attr},values,value,key)=>{
		if(key === undefined){key='classes'}
		let classArray=attr[key].split(' ');
		if(!Array.isArray(values) && _.isObject(values)){values=Object.keys(values);}
		classArray=_.difference(classArray,values);
        if(Array.isArray(value)){classArray=classArray.concat(value);}
		else{classArray.push(value);}
		let data={};
		data[key]=classArray.join(' ');
		set(data);
	},
	getSelectiveClass:({attr},values,key)=>{
		if(key === undefined){key='classes'}
        if(attr[key] === undefined){attr[key]='';}
		let classArray=attr[key].split(' ');
		if(!Array.isArray(values) && _.isObject(values)){values=Object.keys(values);}
		return _.intersection(classArray,values).shift();
	},
	
	getSubClasses:(prm)=>{
		let rtn={};
		let values;
		if(Array.isArray(prm.values)){values=prm.values;}
		else{values=Object.keys(prm.values);}
		values.map((val)=>{
			if(prm.sub && prm.sub[val]){
				rtn[val]=CP.getAllSubClasses(prm.sub[val]);
			}
			else{
				rtn[val]=[];
			}
		});
		return rtn;
	},
	getAllSubClasses:(prms)=>{
		let rtn=[];
		prms.map((prm)=>{
			if(typeof prm === 'object'){
				if(prm.values){
					if(Array.isArray(prm.values)){
						rtn=rtn.concat(prm.values);
					}
					else if(_.isObject(prm.values)){
						rtn=rtn.concat(Object.keys(prm.values));
					}
					else{
						rtn.push(prm.values);
					}
				}
				if(prm.sub){
					if(Array.isArray(prm.sub)){
						rtn=rtn.concat(CP.getAllSubClasses(prm.sub));
					}
					else{
						Object.keys(prm.sub).map((key)=>{
							rtn=rtn.concat(CP.getAllSubClasses(prm.sub[key]));
						});
					}
				}
			}
		});
		return rtn;
	},
	getBindClasses:(prm)=>{
		let rtn={};
		let values;
		if(Array.isArray(prm.values)){values=prm.values;}
		else{values=Object.keys(prm.values);}
		values.map((val)=>{
			if(prm.bind && prm.bind[val]){
				rtn[val]=prm.bind[val];
			}
			else{
				rtn[val]=[];
			}
		});
		return rtn;
	},
	
	toggleClass:({attr,set},value,key)=>{
		if(key === undefined){key='classes'}
        if(attr[key] === undefined){attr[key]='';}
		let classArray=attr[key].split(' ');
		let i=classArray.indexOf(value);
		if(i===-1){classArray.push(value);}
		else{classArray.splice(i,1);}
		let data={};
		data[key]=classArray.join(' ');
		set(data);
	},
	hasClass:({attr},value,key)=>{
		if(key === undefined){key='classes';}
        if(attr[key] === undefined){attr[key]='';}
		return attr[key].split(' ').indexOf(value)!==-1;
	},
	
	selectPrevItem:(tag)=>{
		jQuery(window.getSelection().anchorNode).closest(tag).prev().find('[contentEditable]').get(0).focus();
	},
	selectNextItem:(tag)=>{
		jQuery(window.getSelection().anchorNode).closest(tag).next().find('[contentEditable]').get(0).focus();
	},
	saveItem:({items,index,set})=>{
		set({items:items});
	},
	deleteItem:({items,index,set})=>{
		items.splice(index,1);
		set({items:items});
	},
	cloneItem:({tag,items,index,set})=>{
		items.splice(index,0,jQuery.extend(true,{},items[index]));
		set({items:items});
		CP.selectNextItem(tag);
	},
	upItem:({tag,items,index,set})=>{
		if(!items[index-1])return false;
		items.splice(index-1,2,items[index],items[index-1]);
		set({items:items});
		CP.selectPrevItem(tag);
	},
	downItem:({tag,items,index,set})=>{
		if(!items[index+1])return false;
		items.splice(index,2,items[index+1],items[index]);
		set({items:items});
		CP.selectNextItem(tag);
	},
	
	switchItemColor:({items,index,set},color,itemsKey)=>{
		if(itemsKey === undefined){itemsKey='items';}
		let classArray=items[index].classes.split(' ');
		let i=classArray.findIndex(cls=>(cls.substr(0,5)==='color'));
		if(i===-1){if(color){classArray.push('color'+color);}}
		else{if(color){classArray.splice(i,1,'color'+color);}else{classArray.splice(i,1)}}
		items[index].classes=classArray.join(' ');
		set({[itemsKey]:items});
	},
	getItemColor:({items,index})=>{
		let c=items[index].classes.split(' ').find(cls=>(cls.substr(0,5)==='color'));
		if(!c){return 0;}
		return parseInt(c.substr(5));
	},
	
	switchItemPattern:({items,index,set},pattern,itemsKey)=>{
		if(itemsKey === undefined){itemsKey='items';}
		let classArray=items[index].classes.split(' ');
		let i=classArray.findIndex(cls=>(cls.substr(0,7)==='pattern'));
		if(i===-1){if(pattern){classArray.push('pattern'+pattern);}}
		else{if(pattern){classArray.splice(i,1,'pattern'+pattern);}else{classArray.splice(i,1)}}
		items[index].classes=classArray.join(' ');
		set({[itemsKey]:items});
	},
	getItemPattern:({items,index})=>{
		let p=items[index].classes.split(' ').find(cls=>(cls.substr(0,7)==='pattern'));
		if(!p){return 0;}
		return parseInt(p.substr(7));
	},
	
	switchItemSelectiveClass:({items,index,set},values,value,itemsKey)=>{
		if(itemsKey === undefined){itemsKey='items';}
		let classArray=items[index].classes.split(' ');
		if(!Array.isArray(values) && _.isObject(values)){values=Object.keys(values);}
		classArray=_.difference(classArray,values);
        if(Array.isArray(value)){classArray=classArray.concat(value);}
		else{classArray.push(value);}
		items[index].classes=classArray.join(' ');
		set({[itemsKey]:items});
	},
	getItemSelectiveClass:({items,index},values)=>{
		if(!items[index].classes){return false;}
		let classArray=items[index].classes.split(' ');
		if(!Array.isArray(values) && _.isObject(values)){values=Object.keys(values);}
		return _.intersection(classArray,values).shift();
	},
	
	toggleItemClass:({items,index,set},value,itemsKey)=>{
		if(itemsKey === undefined){itemsKey='items';}
		let classArray=items[index].classes.split(' ');
		let i=classArray.indexOf(value);
		if(i===-1){classArray.push(value);}
		else{classArray.splice(i,1);}
		items[index].classes=classArray.join(' ');
		set({[itemsKey]:items});
	},
	hasItemClass:({items,index},value)=>{
		let classArray=items[index].classes.split(' ');
		return classArray.indexOf(value)!==-1;
	},
    
    getJsonValue:({attr},json,key)=>{
        if(!attr[json]){return null;}
        return JSON.parse(attr[json])[key];
    },
    hasJsonValue:(prop,json,key,value)=>{
        let values=CP.getJsonValue(prop,json,key);
        if(!values){return false;}
		return values.indexOf(value)!==-1;
    },
    setJsonValue:({attr,set},json,key,value)=>{
        let data={};
        let jsonData=JSON.parse(attr[json]);
        jsonData[key]=value;
        data[json]=JSON.stringify(jsonData);
        set(data);
    },
    switchJsonValue:(prop,json,key,value)=>{
        let values=CP.getJsonValue(prop,json,key);
        if(!values){values=[];}
		let i=values.indexOf(value);
		if(i===-1){values.push(value);}
		else{values.splice(i,1);}
        CP.setJsonValue(prop,json,key,values);
    },
	
	parseStyleString:(css)=>{
		if(css instanceof Object){return css;}
		if(!css){return {};}
		var obj={}
		css.split(';').map((pair)=>{
			pair=pair.split(':');
			obj[pair[0]]=pair[1];
		});
		return obj;
	},
};
const SelectResponsiveImage=({className,attr,set,keys,index,sizes,size})=>{
	let type,onClick,item;
	if(keys.items){
		item=attr[keys.items][index];
		onClick=(e)=>CP.selectImage(keys,function(data){
			let rusult={};
			rusult[keys.items]=attr[keys.items].map((obj)=>jQuery.extend(true,{},obj));
			rusult[keys.items][index]=jQuery.extend({},item,data);
			set(rusult);
		},size);
	}
	else{
		item=attr;
		onClick=(e)=>CP.selectImage(keys,set);
	}
	if(item[keys.mime]){type=item[keys.mime].split('/')[0];}
	else{type='image';}
	if(type=='audio'){
		return (
			<audio
				className={'selectImage '+className}
				src={item[keys.src]}
				data-mime={item[keys.mime]}
				onClick={onClick}
				></audio>
		);
	}
	if(item[keys.srcset] && !sizes){sizes='(max-width:640px) 480px,100vw';}
	if(type=='video'){
		return (
			<video
				className={'selectImage '+className}
				src={item[keys.src]}
				data-mime={item[keys.mime]}
				onClick={onClick}
				autoplay={1}
				loop={1}
				playsinline={1}
				muted={1}
				></video>
		);
	}
	return (
		<img
			className={'selectImage '+className}
			src={item[keys.src] || cp.theme_url+'/images/dummy.jpg'}
			alt={item[keys.alt]}
			srcset={item[keys.srcset]}
			sizes={sizes}
			data-mime={item[keys.mime]}
			onClick={onClick}
		/>
	);
};
const ResponsiveImage=({className,attr,keys,index,sizes})=>{
	let type,item;
	if(keys.items){item=attr[keys.items][index];}
	else{item=attr;}
	if(item[keys.mime]){type=item[keys.mime].split('/')[0];}
	else{type='image';}
	if(type=='audio'){
		return (
			<audio
				src={item[keys.src]}
				data-mime={item[keys.mime]}
				></audio>
		);
	}
	if(item[keys.srcset] && !sizes){sizes='(max-width:640px) 480px,100vw';}
	if(type=='video'){
		return (
			<video
				className={className}
				src={item[keys.src]}
				srcset={item[keys.srcset]}
				sizes={sizes}
				data-mime={item[keys.mime]}
				autoplay={1}
				loop={1}
				playsinline={1}
				muted={1}
				></video>
		);
	}
	return (
		<img
			className={className}
			src={item[keys.src]}
			alt={item[keys.alt]}
			srcset={item[keys.srcset]}
			sizes={sizes}
			data-mime={item[keys.mime]}
		/>
	);
}

const Item=(props)=>{
	const {tag,items,itemsKey,index,set,attr,triggerClasses,children}=props;
	let {itemClasses}=props;
	if(!items[index].classes){items[index].classes='item';}
	else if(items[index].classes.search(/\bitem\b/)===-1){items[index].classes+=' item';}
	let classes=items[index].classes;
	if(props.className){classes+=' '+props.className;}
	
	if(attr.currentItemIndex===undefined){attr.currentItemIndex=-1;}
	
	return wp.element.createElement(
		tag,
		{
			className:classes,
			"data-refine-cond":items[index]['cond'],
			onKeyDown:(e)=>{
				if((e.ctrlKey || e.metaKey)){
					switch(e.key){
						case 's':CP.saveItem(props);e.preventDefault();break;
						case 'd':CP.cloneItem(props);e.preventDefault();break;
						case 'Backspace':CP.deleteItem(props);e.preventDefault();break;
						case 'ArrowUp':CP.upItem(props);e.preventDefault();break;
						case 'ArrowDown':CP.downItem(props);e.preventDefault();break;
					}
				}
			},
			onClick:(e)=>{
				set({currentItemIndex:index});
			}
		},
		[
			children,
			<div className='itemControl'>
				<div className='btn delete' onClick={(e)=>CP.deleteItem(props)}></div>
				<div className='btn clone' onClick={(e)=>CP.cloneItem(props)}></div>
				<div className='btn up' onClick={(e)=>CP.upItem(props)}></div>
				<div className='btn down' onClick={(e)=>CP.downItem(props)}></div>
			</div>
		]
	);
}
const ItemControlInfoPanel=()=>{
	return (
		<PanelBody title="操作" initialOpen={false} icon="info">
			<table>
				<tbody>
					<tr>
						<th>⌘/Ctrl + S</th>
						<td>保存</td>
					</tr>
					<tr>
						<th>⌘/Ctrl + D</th>
						<td>複製</td>
					</tr>
					<tr>
						<th>⌘/Ctrl + delete</th>
						<td>削除</td>
					</tr>
					<tr>
						<th>⌘/Ctrl + ↑</th>
						<td>前のアイテムと入れ替え</td>
					</tr>
					<tr>
						<th>⌘/Ctrl + ↓</th>
						<td>次のアイテムと入れ替え</td>
					</tr>
				</tbody>
			</table>
		</PanelBody>
	);
}

const SelectClassPanel=(props)=>{
	const SelectClass=(prm)=>{
		let rtn=[];
        if(prm.json){
            if(prm.input){
                switch(prm.input){
                    case 'text':
                        rtn.push(
                            <TextControl
                                label={prm.label}
                                value={JSON.parse(props.attr[prm.json])[prm.key]}
                                onChange={(val)=>{CP.setJsonValue(props,prm.json,prm.key,val);}}
                            />
                        );
                        break;
                    case 'range':
                        if(!prm.coef){prm.coef=1;}
                        rtn.push(
                            <RangeControl
                                label={prm.label}
                                value={CP.getJsonValue(props,prm.json,prm.key)/prm.coef}
                                onChange={(val)=>{CP.setJsonValue(props,prm.json,prm.key,val*prm.coef);}}
                                min={prm.min}
                                max={prm.max}
                            />
                        );
                        break;
                        
                }
            }
            else if(_.isObject(prm.values)){
                let options,values;
                if(Array.isArray(prm.values)){
                    values=prm.values;
                    options=prm.values.map(cls=>{return {label:cls,value:cls};});
                }
                else{
                    values=Object.keys(prm.values);
                    options=values.map((cls)=>{return {label:prm.values[cls],value:cls};});
                }
                rtn.push(
                    <SelectControl
                        label={prm.label}
                        value={CP.getJsonValue(props,prm.json,prm.key)}
                        onChange={(val)=>{CP.setJsonValue(props,prm.json,prm.key,val);}}
                        options={options}
                    />
                );
            }
            else if(prm.values){
                rtn.push(
                    <CheckboxControl
                        label={prm.label}
                        onChange={()=>{CP.switchJsonValue(props,prm.json,prm.key,prm.values);}}
                        checked={CP.hasJsonValue(props,prm.json,prm.key,prm.values)}
                    />
                );
            }
            else{
                rtn.push(
                    <TextControl
                        label={prm.label}
                        value={JSON.parse(props.attr[prm.json])[prm.key]}
                        onChange={(val)=>{CP.setJsonValue(props,prm.json,prm.key,val);}}
                    />
                );
            }
        }
        else{
            if(prm === 'color'){
                rtn.push(
                    <SelectColorClass
                        label='色'
                        set={props.set}
                        attr={props.attr}
                    />
                );
            }
            else if(prm === 'pattern'){
                rtn.push(
                    <RangeControl
                        label='パターン'
                        onChange={(clr)=>CP.switchPattern(props,clr)}
                        value={CP.getPattern(props)}
                        min={0}
                        max={5}
                    />
                );
            }
            else if(prm.input){
                switch(prm.input){
                    case 'text':
                        rtn.push(
                            <TextControl
                                label={prm.label}
                                value={props.attr[prm.key]}
                                onChange={(val)=>{let data={};data[prm.key]=val;props.set(data);}}
                            />
                        );
                        break;
                    case 'range':
                        if(!prm.coef){prm.coef=1;}
                        rtn.push(
                            <RangeControl
                                label={prm.label}
                                value={props.attr[prm.key]/prm.coef}
                                onChange={(val)=>{let data={};data[prm.key]=val*prm.coef;props.set(data);}}
                                min={prm.min}
                                max={prm.max}
                            />
                        );
                        break;
                    case 'image':
                        rtn.push(
                            <SelectResponsiveImage
                                set={props.set}
                                attr={props.attr}
                                keys={prm.keys}
                                size={prm.size}
                            />
                        );
                        break;
					case 'position':
						rtn.push(
							<SelectPositionClass
                                set={props.set}
                                attr={props.attr}
								label={prm.label}
                                key={prm.key}
								help={prm.help}
								disable={prm.disable}
							/>
						);
                }
            }
            else if(_.isObject(prm.values)){
                let subClasses=CP.getSubClasses(prm);
                let bindClasses=CP.getBindClasses(prm);

                let options,values;
                if(Array.isArray(prm.values)){
                    values=prm.values;
                    options=prm.values.map(cls=>{return {label:cls,value:cls};});
                }
                else{
                    values=Object.keys(prm.values);
                    options=values.map((cls)=>{return {label:prm.values[cls],value:cls};});
                }

                rtn.push(
                    <SelectControl
                        label={prm.label}
                        onChange={(cls)=>{
                            let prevCls=CP.getSelectiveClass(props,prm.values,prm.key);
                            let sels=[];
                            if(prevCls){
                                if(subClasses[prevCls]){sels=sels.concat(subClasses[prevCls]);}
                                if(bindClasses[prevCls]){sels=sels.concat(bindClasses[prevCls]);}
                                sels=_.difference(sels,subClasses[cls]);
                            }
                            sels=sels.concat(values);

                            CP.switchSelectiveClass(
                                props,sels,
                                bindClasses[cls].concat([cls]),
                                prm.key
                            );
                        }}
                        value={CP.getSelectiveClass(props,prm.values,prm.key)}
                        options={options}
                    />
                );

                if(prm.sub){
                    let currentClass=CP.getSelectiveClass(props,prm.values,prm.key);
                    if(currentClass && prm.sub[currentClass]){
                        let sub=[];
                        prm.sub[currentClass].map((prm)=>{sub.push(SelectClass(prm))});
                        rtn.push(<div className="sub">{sub}</div>);
                    }
                }
            }
            else{
                rtn.push(
                    <CheckboxControl
                        label={prm.label}
                        onChange={()=>{CP.toggleClass(props,prm.values,prm.key);}}
                        checked={CP.hasClass(props,prm.values,prm.key)}
                    />
                );
                if(prm.sub){
                    if(CP.hasClass(props,prm.values,prm.key)){
                        let sub=[];
                        prm.sub.map((prm)=>{sub.push(SelectClass(prm))});
                        rtn.push(<div className="sub">{sub}</div>);
                    }
                }
            }
        }
		return rtn;
	};
	return (
		<PanelBody title={props.title} initialOpen={false} icon={props.icon}>
			{props.selectiveClasses.map(SelectClass)}
		</PanelBody>
	)
}
const SelectItemClassPanel=(props)=>{
	const {items,itemsKey,index,set,attr,triggerClasses}=props;

	if(!items[index]){return false;}
	
	let {itemClasses}=props;
	if(!items[index].classes){items[index].classes='item';}
	else if(items[index].classes.search(/\bitem\b/)===-1){items[index].classes+=' item';}
	let classes=items[index].classes;
	if(props.className){classes+=' '+props.className;}
	
	if(triggerClasses && triggerClasses.item){
		itemClasses=triggerClasses.item[CP.getSelectiveClass(props,triggerClasses.values)];
		if(Array.isArray(itemClasses) && itemClasses.length===0){itemClasses=false;}
	}
	

	const selectItemClass=(prm)=>{
		let rtn=[];
		if(prm === 'color'){
			rtn.push(
				<SelectItemColorClass
					label='色'
					set={set}
					attr={attr}
					items={items}
					index={index}
					itemsKey={itemsKey}
				/>
			);
		}
		else if(prm === 'pattern'){
			rtn.push(
				<RangeControl
					label='パターン'
					onChange={(clr)=>CP.switchItemPattern(props,clr,itemsKey)}
					value={CP.getItemPattern(props)}
					min={0}
					max={5}
				/>
			);
		}
		else if(prm === 'cond'){
			rtn.push(
				<TextareaControl
					label='表示条件'
					value={items[index]['cond']}
					onChange={(cond)=>{
						items[index]['cond']=cond;
						if(itemsKey===undefined){set({items});}
						else{set({[itemsKey]:items})}
					}}
				/>
			);
		}
		else if(prm === 'event'){
			if(cp.use_functions.indexOf('ga')>-1){
				var {parseEventString,createEventString}=window.Catpow.ga;
				var eventData=parseEventString(items[index]['event']);
				var params={event:'イベント',action:'アクション',category:'カテゴリ',label_name:'ラベル名',label:'ラベル',value:'値'};
				rtn.push(
					<BaseControl label="Google Analitics Event">
						<table>
							{Object.keys(params).map((key)=>{
								return (
									<tr>
										<th width="80">{params[key]}</th>
										<td>
											<TextControl
												value={eventData[key]}
												type={key=='value'?'number':'text'}
												onChange={(val)=>{
													eventData[key]=val;
													items[index]['event']=createEventString(eventData);
													if(itemsKey===undefined){set({items});}
													else{set({[itemsKey]:items})}
												}}
											/>
										</td>
									</tr>
								);
							})}
						</table>
					</BaseControl>
				);
			}
		}
		else if(_.isObject(prm.values)){
			let options;
			if(Array.isArray(prm.values)){
				options=prm.values.map(cls=>{return {label:cls,value:cls};});
			}
			else{
				options=Object.keys(prm.values).map((cls)=>{return {label:prm.values[cls],value:cls};});
			}
			rtn.push(
				<SelectControl
					label={prm.label}
					onChange={(cls)=>CP.switchItemSelectiveClass(props,prm.values,cls,itemsKey)}
					value={CP.getItemSelectiveClass(props,prm.values)}
					options={options}
				/>
			);
			if(prm.sub){
				let currentClass=CP.getItemSelectiveClass(props,prm.values);
				if(currentClass && prm.sub[currentClass]){
					let sub=[];
					prm.sub[currentClass].map((prm)=>{sub.push(SelectItemClass(prm))});
					rtn.push(<div className="sub">{sub}</div>);
				}
			}
		}
		else{
			rtn.push(
				<CheckboxControl
					label={prm.label}
					onChange={()=>{CP.toggleItemClass(props,prm.values,itemsKey);}}
					checked={CP.hasItemClass(props,prm.values)}
				/>
			);
			if(prm.sub){
				if(CP.hasItemClass(props,prm.values)){
					let sub=[];
					prm.sub.map((prm)=>{sub.push(selectItemClass(prm))});
					rtn.push(<div className="sub">{sub}</div>);
				}
			}
		}
		return rtn;
	};

	if(!itemClasses){return false;}
	return (
		<PanelBody title={props.title} initialOpen={false} icon={props.icon}>
			{itemClasses.map(selectItemClass)}
		</PanelBody>
	)
}

const AlignClassToolbar=(props)=>{
	const aligns=['left','center','right'];
	return (
		<BlockAlignmentToolbar
			value={CP.getSelectiveClass(props,aligns)}
			onChange={(align)=>{CP.switchSelectiveClass(props,aligns,align,props.key)} }
		/>
	);
}
const SelectColorClass=(props)=>{
	const {label,help}=props;
	
	var color=CP.getColor(props);
	var items=Array.from(Array(13),(v,i)=>{
		var classes='fillColor'+i;
		if(color==i){classes+=' active';}
		return (
			<li className={classes} onClick={()=>{CP.switchColor(props,i);}}> </li>
		);
	});;
	
	return (
		<BaseControl label={label} help={help}>
			<ul class="selectColor">{items}</ul>
		</BaseControl>
	);
}
const SelectItemColorClass=(props)=>{
	const {label,help,itemsKey}=props;
	
	var color=CP.getItemColor(props);
	var items=Array.from(Array(13),(v,i)=>{
		var classes='fillColor'+i;
		if(color==i){classes+=' active';}
		return (
			<li className={classes} onClick={()=>{CP.switchItemColor(props,i,itemsKey);}}> </li>
		);
	});;
	
	return (
		<BaseControl label={label} help={help}>
			<ul class="selectColor">{items}</ul>
		</BaseControl>
	);
}

const SelectPositionClass=(props)=>{
	const rows=[
		['topLeft','top','topRight'],
		['left','center','right'],
		['bottomLeft','bottom','bottomRight'],	
	];
	const values=_.flatten(rows);
	let value=CP.getSelectiveClass(props,values);
	
	const {label,help,disable}=props;
	
	return (
		<BaseControl label={label} help={help}>
			<table className="selectPosition">
				<tbody>
				{rows.map((cols)=>(
					<tr>
					{cols.map((col)=>{
						var isChecked=value==col;
						if(disable && disable.includes(col)){return <td className="disable"> </td>;}
						return (
							<td
								className={isChecked?"active":""}
								onClick={()=>{CP.switchSelectiveClass(props,values,col,props.key)}}
							> </td>
						);
					})}
					</tr>
				))}
				</tbody>
			</table>
		</BaseControl>
	);
}

const ImporterCSVPanel=(props)=>{
	let reader=new FileReader();
	reader.onload=(e)=>{
		props.callback(CP.parseCSV(e.target.result));
	}
	return (
		<PanelBody title={props.title} initialOpen={false} icon={props.icon}>
			<FormFileUpload
				label='CSV'
				accept="text/csv"
				onChange={(e)=>{reader.readAsText(e.target.files[0]);}}
			/>
		</PanelBody>
	)
}