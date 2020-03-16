registerBlockType('catpow/buttons',{
	title: '🐾 Buttons',
	icon: (
		<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
			<path d="M19.5,11c0,2.8-2.2,5-5,5h-9c-2.8,0-5-2.2-5-5V9c0-2.8,2.2-5,5-5h9c2.8,0,5,2.2,5,5V11z M5.5,5c-2.2,0-4,1.8-4,4
				c0,2.2,1.8,4,4,4h9c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4H5.5z"/>
		</svg>
	),
	category: 'catpow',
	attributes:{
		version:{type:'number',default:0},
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-buttons buttons'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				event:{source:'attribute',selector:'.button',attribute:'data-event'},
				text:{source:'text',selector:'.button'},
				url:{source:'attribute',selector:'.button',attribute:'href'},
			},
			default:[
				{classes:'item mail primary',event:'',text:'お問合せ',url:'[home_url]/contact'}
			]
		}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {items,classes}=attributes;
		const primaryClass='wp-block-catpow-buttons';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
        
		var selectiveClasses=[
			{label:'サイズ',values:{l:'大',m:'中',s:'小',ss:'極小'}},
			{label:'インライン',values:'i'}
		];
		const itemClasses=[
			'color',
			{label:'属性',values:['default','primary','negative','danger','secure']},
			{label:'アイコン','values':[
				'play','next','back',
				'file','home','trash',
				'cart','mail','search',
				'caution','help',
				'open','close',
				'plus','minus',
				'refresh','edit','check'
			]},
			'event'
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		let rtn=[];
		
		itemsCopy.map((item,index)=>{
			rtn.push(
				<Item
					tag='li'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={index}
					isSelected={isSelected}
				>
					<div class="button">
						<span
							onInput={(e)=>{
								itemsCopy[index].text=e.target.innerText;
							}}
							onBlur={(e)=>{setAttributes({items:itemsCopy});}}
							contentEditable="true"
						>{item.text}</span>
						{isSelected &&
							<span class="url"
								onInput={(e)=>{
									itemsCopy[index].url=e.target.innerText;
								}}
								onBlur={(e)=>{setAttributes({items:itemsCopy});}}
								contentEditable="true"
							>{item.url}</span>
						}
					</div>
				</Item>
			);
		});
		
		if(attributes.EditMode===undefined){attributes.EditMode=false;}
		
        return [
			<ul className={classes}>{rtn}</ul>,
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
				<SelectItemClassPanel
					title='ボタン'
					icon='edit'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={attributes.currentItemIndex}
					itemClasses={itemClasses}
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
			<BlockControls>
				<AlignClassToolbar set={setAttributes} attr={attributes}/>
			</BlockControls>
        ];
    },
	save({attributes,className}){
		const {items,classes}=attributes;
		var classArray=_.uniq(attributes.classes.split(' '));
		
		
		let rtn=[];
		items.map((item,index)=>{
			rtn.push(
				<li className={item.classes}>
					<a href={item.url} className='button' data-event={item.event}>{item.text}</a>
				</li>
			);
		});
		return <ul className={classes}>{rtn}</ul>;
	},
});