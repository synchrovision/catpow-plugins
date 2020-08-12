﻿registerBlockType('catpow/panel',{
	title: '🐾 Panel',
	icon: 'grid-view',
	category: 'catpow',
	attributes:{
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-panel panel tile column1 grid32'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				src:{source:'attribute',selector:'.image [src]',attribute:'src'},
				alt:{source:'attribute',selector:'.image [src]',attribute:'alt'},
				title:{source:'children',selector:'.text h3'},
				text:{source:'children',selector:'.text p'},
				iconSrc:{source:'attribute',selector:'.text .icon [src]',attribute:'src'},
				iconAlt:{source:'attribute',selector:'.text .icon [src]',attribute:'alt'},
				linkUrl:{source:'attribute',selector:'.text .link a',attribute:'href'},
				linkText:{source:'text',selector:'.text .link a'},
			},
			default:[...Array(8)].map((n,i)=>{
				return {
					classes:'item hasIcon hasLink hasTitle rspan1 cspan1 color'+i*2,
					src:cp.theme_url+'/images/dummy.jpg',
					alt:'dummy',
					title:['Title'],
					text:['Text'],
					iconSrc:cp.theme_url+'/images/dummy_icon.svg',
					iconAlt:'dummy',
					linkUrl:cp.home_url
				}
			})
		}
	},
	example:CP.example,
	edit({attributes,className,setAttributes,isSelected}){
		const {classes,items}=attributes;
		const primaryClass='wp-block-catpow-panel';
		var classArray=_.uniq((classes).split(' '));
		
		const imageKeys={
			icon:{src:"iconSrc",alt:"iconAlt",items:"items"},
			image:{src:"src",alt:"alt",items:"items"}
		};
		
		var selectiveClasses=[
			{
				label:'タイプ',
				filter:'type',
				values:{tile:'タイル',menu:'メニュー'},
				item:{
					tile:[
						'color',
						{label:'白文字',values:'brightText',sub:[
							{label:'色付き背景',values:'colorBG'}
						]},
						{label:'アイコン',values:'hasIcon'},
						{label:'タイトル',values:'hasTitle'},
						{label:'文章',values:'hasText'},
						{label:'画像',values:'hasImage',sub:[
							{label:'画像を薄く',values:'paleImage'},
							{label:'画像',input:'image',keys:imageKeys.image,size:'vga'}
						]},
						{label:'リンク',values:'hasLink',sub:[
							{label:'外部リンク',values:'linkExternal'}
						]},
						{label:'縦サイズ',values:{rspan1:'1',rspan2:'2',rspan3:'3'}},
						{label:'横サイズ',values:{cspan1:'1',cspan2:'2',cspan3:'3'}}
					],
					menu:[
						'color',
						{label:'アイコン',values:'hasIcon'},
						{label:'タイトル',values:'hasTitle'},
						{label:'文章',values:'hasText'},
						{label:'画像',values:'hasImage',sub:[
							{label:'画像',input:'image',keys:imageKeys.image,size:'vga'}
						]},
						{label:'リンク',values:'hasLink',sub:[
							{label:'外部リンク',values:'linkExternal'}
						]},
						{label:'縦サイズ',values:{rspan1:'1',rspan2:'2',rspan3:'3'}},
						{label:'横サイズ',values:{cspan1:'1',cspan2:'2',cspan3:'3'}}
					]
				},
				bind:{
					tile:['panel'],
					menu:['panel']
				}
			},
			{
				label:'サイズ',
				values:{
					column1:'1/1',
					column2:'1/2',
					column3:'1/3',
					column4:'1/4'
				}
			},
			{
				label:'カラム数',
				values:{
					grid18:'1-2-3-6-9-18',
					grid24:'1-2-3-4-6-8-12-24',
					grid27:'1-3-9-27',
					grid32:'1-2-4-8-16-32',
				}
			}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		let rtn=[];
		
		let totalGrid=0;

		itemsCopy.map((item,index)=>{
			if(!item.controlClasses){item.controlClasses='control';}
			var itemStates={
				hasIcon:false,
				hasTitle:false,
				hasText:false,
				hasImage:false,
				hasLink:false,
				linkExternal:false
			}
			var itemClassArray=item.classes.split(' ');
			Object.keys(itemStates).forEach(function(key){this[key]=itemClassArray.indexOf(key)!==-1;},itemStates);
			
			totalGrid+=
				(CP.getNumberClass({attr:item},'rspan') || 1) * 
				(CP.getNumberClass({attr:item},'cspan') || 1);
			
			rtn.push(
				<Item
					tag='li'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={index}
					isSelected={isSelected}
				>
					{itemStates.hasImage &&
						<div className='image'>
							<SelectResponsiveImage
								attr={attributes}
								set={setAttributes}
								keys={imageKeys.image}
								index={index}
								size='vga'
							/>
						</div>
					}
					<div class="text">
						{itemStates.hasIcon &&
							<div className='icon'>
								<SelectResponsiveImage
									attr={attributes}
									set={setAttributes}
									keys={imageKeys.icon}
									index={index}
									size='thumbnail'
								/>
							</div>
						}
						{itemStates.hasTitle && 
							<h3>
								<RichText
									onChange={(title)=>{itemsCopy[index].title=title;setAttributes({items:itemsCopy});}}
									value={item.title}
								/>
							</h3>
						}
						{itemStates.hasText &&
							<p>
								<RichText
									onChange={(text)=>{itemsCopy[index].text=text;setAttributes({items:itemsCopy});}}
									value={item.text}
								/>
							</p>
						}
						{itemStates.hasLink &&
							<div className='link'>
								<TextControl onChange={(linkUrl)=>{
									itemsCopy[index].linkUrl=linkUrl;
									setAttributes({items:itemsCopy});
								}} value={item.linkUrl}/>
							</div>
						}
					</div>
				</Item>
			);
		});
		
		if(attributes.EditMode===undefined){attributes.EditMode=false;}
		
        return [
			<BlockControls>
				<Toolbar
					controls={[
						{
							icon:'edit',
							title:'EditMode',
							isActive:attributes.EditMode,
							onClick:()=>setAttributes({EditMode:!attributes.EditMode})
						}
					]}
				/>
			</BlockControls>,
			<ul class={attributes.EditMode?(primaryClass+' edit'):classes}>{rtn}</ul>,
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<SelectItemClassPanel
					title='パネル'
					icon='edit'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={attributes.currentItemIndex}
					triggerClasses={selectiveClasses[0]}
				/>
				<PanelBody title="info" icon="admin-generic" initialOpen={false}>
					<p>合計グリッド数：{totalGrid}</p>
				</PanelBody>
				<PanelBody title="CLASS" icon="admin-generic" initialOpen={false}>
					<TextareaControl
						label='クラス'
						onChange={(clss)=>setAttributes({classes:clss})}
						value={classArray.join(' ')}
					/>
				</PanelBody>
				<ItemControlInfoPanel/>
			</InspectorControls>
        ];
    },
	save({attributes,className}){
		const {classes,items}=attributes;
		let rtn=[];
		items.map((item,index)=>{
			var itemStates={
				hasIcon:false,
				hasTitle:false,
				hasText:false,
				hasImage:false,
				hasLink:false,
				linkExternal:false
			}
			var itemClassArray=item.classes.split(' ');
			Object.keys(itemStates).forEach(function(key){this[key]=itemClassArray.indexOf(key)!==-1;},itemStates);
		
			
			rtn.push(
				<li class={item.classes}>
					{itemStates.hasImage && <div className='image'><img src={item.src} alt={item.alt}/></div>}
					<div class="text">
						{itemStates.hasIcon && <div class="icon"><img src={item.iconSrc} alt={item.iconAlt}/></div>}
						{itemStates.hasTitle && <h3>{item.title}</h3>}
						{itemStates.hasText && <p>{item.text}</p>}
						{itemStates.hasLink &&
							<div className='link'>
								<a
									href={item.linkUrl}
									target={itemStates.linkExternal?'_brank':false}
									rel={itemStates.linkExternal?'noopener noreferrer':'bookmark'}
								> </a>
							</div>
						}
					</div>
				</li>
			);
		});
		return (
			<ul className={classes}>{rtn}</ul>
		);
	}
});
