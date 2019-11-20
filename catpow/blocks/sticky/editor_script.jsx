registerBlockType('catpow/sticky',{
	title:'🐾 Sticky',
	icon:'menu',
	category:'catpow',
	attributes:{
		classes:{source:'attribute',selector:'div',attribute:'class',default:'wp-block-catpow-sticky bottom'},
		
		openButtonImageSrc:{source:'attribute',selector:'.wp-block-catpow-sticky>.stickyMenuButton [src].open',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		closeButtonImageSrc:{source:'attribute',selector:'.wp-block-catpow-sticky>.stickyMenuButton [src].close',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
	},
	edit({attributes,className,setAttributes}){
        const {classes}=attributes;
		const primaryClass='wp-block-catpow-sticky';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
		var states={
			collapsible:false,
			imageButton:false
		}
		
		const imageKeys={
			openButtonImage:{src:"openButtonImageSrc"},
			closeButtonImage:{src:"closeButtonImageSrc"}
		};
		
		var selectiveClasses=[
			{label:'位置',values:{left:'左',right:'右',top:'上',bottom:'下'}},
			{
				label:'折り畳み',
				values:'collapsible',
				sub:[
					'color',
					{
						label:'ボタンタイプ',
						values:{pullButton:'引き出し',menuButton:'メニュー'},
						sub:{
							imageButton:[
								{label:'open',input:'image',keys:imageKeys.openButtonImage,size:'thumbnail'},
								{label:'close',input:'image',keys:imageKeys.closeButtonImage,size:'thumbnail'}
							]
						}
					},
					{label:'画像ボタン',values:'imageButton',
						sub:[
							{label:'open',input:'image',keys:imageKeys.openButtonImage,size:'thumbnail'},
							{label:'close',input:'image',keys:imageKeys.closeButtonImage,size:'thumbnail'}
						]
					},
					{label:'ボタンの位置',values:{
						buttonPositionStart:'上・左',
						buttonPositionCenter:'中央',
						buttonPositionEnd:'下・右'
					}},
					{label:'サイズ',values:{fill:'全面',large:'大',small:'小'}}
				]
			}
		];
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
        return [
			<div className={classes}>
				{states.collapsible && 
					<div class="stickyMenuButton">
						<div class="stickyMenuButtonIcon">
							{states.imageButton && [
								<ResponsiveImage
									className='open'
									attr={attributes}
									keys={imageKeys.openButtonImage}
								/>,
								<ResponsiveImage
									className='close'
									attr={attributes}
									keys={imageKeys.closeButtonImage}
								/>
							]}
						</div>
					</div>
				}
				<div class="content">
					<InnerBlocks/>
				</div>
			</div>,
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
			</InspectorControls>
        ];
    },


	save({attributes,className,setAttributes}){
        const {classes}=attributes;
		
		var classArray=classes.split(' ');
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		var collapsible=hasClass('collapsible');
		var imageButton=hasClass('imageButton');
		
		const imageKeys={
			openButtonImage:{src:"openButtonImageSrc"},
			closeButtonImage:{src:"closeButtonImageSrc"}
		};
		
		return (
			<div className={classes}>
				{collapsible && 
					<div class="stickyMenuButton">
						<div class="stickyMenuButtonIcon">
							{imageButton && [
								<ResponsiveImage
									className='open'
									attr={attributes}
									keys={imageKeys.openButtonImage}
								/>,
								<ResponsiveImage
									className='close'
									attr={attributes}
									keys={imageKeys.closeButtonImage}
								/>
							]}
						</div>
					</div>
				}
				<div class="content">
					<InnerBlocks.Content/>
				</div>
			</div>
		);
	}
});

