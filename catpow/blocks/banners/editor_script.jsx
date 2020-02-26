﻿registerBlockType('catpow/banners',{
	title: '🐾 Banners',
	icon: 'image-alt',
	category: 'catpow',
	transforms:{
		from: [
			{
				type:'block',
				blocks:CP.listedConvertibles,
				transform:(attributes)=>{
					attributes.classes='wp-block-catpow-banners medium hasTitle';
					return createBlock('catpow/banners',attributes);
				}
			}
		]
	},
	attributes:{
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-banners medium hasTitle'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				title:{source:'children',selector:'h3'},
				src:{source:'attribute',selector:'[src]',attribute:'src'},
				alt:{source:'attribute',selector:'[src]',attribute:'alt'},
				linkUrl:{source:'attribute',selector:'a',attribute:'href'},
			},
			default:[...Array(3)].map(()=>{
				return {
					classes:'item',
					title:['Title'],
					src:cp.theme_url+'/images/dummy.jpg',
					alt:'dummy',
					linkUrl:cp.home_url
				}
			})
		}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {items,classes}=attributes;
		const primaryClass='wp-block-catpow-banners';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
		var states={
			hasTitle:false
		}
		
        
		var selectiveClasses=[
			{label:'サイズ',values:['small','medium','large']},
			{label:'タイトル',values:'hasTitle'}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		let rtn=[];
		const imageKeys={
			image:{src:"src",alt:"alt",items:"items"}
		};

		itemsCopy.map((item,index)=>{
			if(!item.controlClasses){item.controlClasses='control';}
			rtn.push(
				<Item
					tag='li'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={index}
				>
					{states.hasTitle &&
						<h3>
							<RichText
								onChange={(text)=>{itemsCopy[index].title=text;setAttributes({items:itemsCopy});}}
								value={item.title}
							/>
						</h3>
					}
					<SelectResponsiveImage
						attr={attributes}
						set={setAttributes}
						keys={imageKeys.image}
						index={index}
						size='vga'
					/>
					<div className='link'>
						<TextControl onChange={(linkUrl)=>{
							itemsCopy[index].linkUrl=linkUrl;
							setAttributes({items:itemsCopy});
						}} value={item.linkUrl} placeholder='URLを入力'/>
					</div>
				</Item>
			);
		});
		
		if(attributes.EditMode===undefined){attributes.EditMode=false;}
		
        return [
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<PanelBody title="CLASS" icon="admin-generic" initialOpen={false}>
					<TextareaControl
						label='クラス'
						onChange={(clss)=>setAttributes({classes:clss})}
						value={classArray.join(' ')}
					/>
				</PanelBody>
				<ItemControlInfoPanel/>
			</InspectorControls>,
			<ul className={attributes.EditMode?(primaryClass+' edit'):classes}>{rtn}</ul>
        ];
    },
	save({attributes,className}){
		const {items,classes}=attributes;
		var classArray=_.uniq(attributes.classes.split(' '));
		
		var states={
			hasTitle:false
		}
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		return <ul className={classes}>{
			items.map((item,index)=>{
				return (
					<li className={item.classes}>
						{states.hasTitle && <h3>{item.title}</h3>}
						<a href={item.linkUrl}><img src={item.src} alt={item.alt}/> </a>
					</li>
				);
			})
		}</ul>;
	},
});