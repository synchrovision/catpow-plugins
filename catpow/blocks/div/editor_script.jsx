registerBlockType('catpow/div',{
	title:'🐾 Div',
	icon:'editor-code',
	category:'catpow',
	attributes:{
		classes:{source:'attribute',selector:'div',attribute:'class',default:'wp-block-catpow-div frame thin_border'},
		
		backgroundImageSrc:{source:'attribute',selector:'.wp-block-catpow-div>.background [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		backgroundImageSrcset:{source:'attribute',selector:'.wp-block-catpow-div>.background [src]',attribute:'srcset'},
	},
	edit({attributes,className,setAttributes}){
        const {classes}=attributes;
		const primaryClass='wp-block-catpow-div';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
		var states={
			hasBackgroundImage:false
		}
		
		const imageKeys={
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset"}
		};
		
		var selectiveClasses=[
			{
				label:'タイプ',
				values:['block','frame','columns'],
				sub:{
					frame:[
						{label:'色',values:'has_color',sub:['color']},
						{label:'パターン',values:'has_pattern',sub:['pattern']},
						{label:'アイコン',values:'has_icon',sub:[
							{
								label:'タイプ',
								values:{
									check:'チェック',
									point:'ポイント',
									info:'情報',
									help:'ヘルプ',
									alert:'注意',
									warn:'警告',
									search:'検索',
									phone:'電話',
									email:'メール',
									price:'価格',
									review:'レビュー',
									favor:'お気に入り'
								}
							}
						]},
						{label:'線',values:{no_border:'なし',thin_border:'細',bold_border:'太'}},
						{label:'角丸',values:'round'},
						{label:'影',values:'shadow',sub:[{label:'内側',values:'inset'}]}
					],
					columns:[
						{label:'幅',values:{narrow:'狭い',regular:'普通',wide:'広い'}}
					]
				}
			},
			{label:'背景画像',values:'hasBackgroundImage',sub:[
				{input:'image',keys:imageKeys.backgroundImage}
			]},
			{label:'余白','values':{noPad:'なし',thinPad:'極細',lightPad:'細',mediumPad:'中',boldPad:'太',heavyPad:'極太'}}
		];
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
        return [
			<div className={classes}>
				{states.hasBackgroundImage && 
					<div class="background">
						<ResponsiveImage
							set={setAttributes}
							attr={attributes}
							keys={imageKeys.backgroundImage}
						/>
					</div>
				}
				<InnerBlocks/>
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
		var hasBackgroundImage=hasClass('hasBackgroundImage');
		
		const imageKeys={
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset"}
		};
		
		return (
			<div className={classes}>
				{hasBackgroundImage && 
					<div class="background">
						<ResponsiveImage
							attr={attributes}
							keys={imageKeys.backgroundImage}
						/>
					</div>
				}
				<InnerBlocks.Content/>
			</div>
		);
	}
});

