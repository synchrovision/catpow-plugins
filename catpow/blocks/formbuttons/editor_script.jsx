registerBlockType('catpow/formbuttons',{
	title: '🐾 FormButtons',
	icon: 'upload',
	category: 'catpow',
	attributes:{
		version:{type:'number',default:0},
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-formbuttons buttons'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				button:{source:'text'}
			},
			default:[
				{classes:'item',button:'[button 送信 send]'}
			]
		}
	},
	edit({attributes,className,setAttributes}){
		const {items,classes}=attributes;
		const primaryClass='wp-block-catpow-formbuttons';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
        
		var selectiveClasses=[
			{
				label:'タイプ',
				values:{buttons:'ボタン'},
				sub:{
					buttons:[
						{label:'サイズ',values:{l:'大',m:'中',s:'小',ss:'極小'}}
					]
				},
				item:{
					buttons:[
						{label:'属性',values:['default','primary','negative','danger','secure']},
						{label:'アイコン','values':[
							'play','next','back',
							'file','home','trash',
							'cart','mail','search',
							'caution','help',
							'open','close',
							'plus','minus',
							'refresh','edit','check'
						]}
					]
				}
			}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		let rtn=[];
		
		const parseButtonShortCode=(code)=>{
			let matches=code.match(/^\[button ([^ ]+) ([^ ]+)( ignore_message\=1)?\]$/);
			if(matches){
				let rtn={content:matches[1],action:matches[2]};
				if(matches[3]){rtn.ignore_message=1;}
				return rtn;
			}
			return {content:'送信'}
		};
		const createButtonShortCode=(prm)=>{
			let rtn='[button '+prm.content+' '+prm.action;
			if(prm.ignore_message){rtn+=' ignore_message=1';}
			rtn+=']';
			return rtn;
		};
		
		itemsCopy.map((item,index)=>{
			if(!item.controlClasses){item.controlClasses='control';}
			let buttonParam=parseButtonShortCode(item.button);
			rtn.push(
				<Item tag='li' set={setAttributes} items={itemsCopy} index={index}>
					<div class="button">
						<span
							onInput={(e)=>{
								buttonParam.content=e.target.innerText;
								itemsCopy[index].button=createButtonShortCode(buttonParam);
							}}
							onBlur={(e)=>{setAttributes({items:itemsCopy});}}
							contentEditable="true"
						>{buttonParam.content}</span>
						<span class="action"
							onInput={(e)=>{
								buttonParam.action=e.target.innerText;
								itemsCopy[index].button=createButtonShortCode(buttonParam);
							}}
							onBlur={(e)=>{setAttributes({items:itemsCopy});}}
							contentEditable="true"
						>{buttonParam.action}</span>
					</div>
					<ItemControl
						set={setAttributes}
						attr={attributes}
						items={itemsCopy}
						index={index}
						triggerClasses={selectiveClasses[0]}
					/>
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
				<li className={item.classes}>{item.button}</li>
			);
		});
		return <ul className={classes}>{rtn}</ul>;
	},
});