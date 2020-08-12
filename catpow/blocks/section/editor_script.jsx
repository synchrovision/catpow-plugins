registerBlockType('catpow/section',{
	title: '🐾 Section',
	description:'見出しと本文のセット',
	icon: 'id-alt',
	category: 'catpow',
	attributes:{
		id:{source:'attribute',selector:'section',attribute:'id'},
		classes:{source:'attribute',selector:'section',attribute:'class',default:'wp-block-catpow-section article level3 center catch'},
		icon:{source:'attribute',selector:'section',attribute:'data-icon'},

		prefix:{source:'children',selector:'header div.prefix'},
		title:{type:'array',source:'children',selector:'header h2,header .heading',default:['Title']},
		read:{type:'array',source:'children',selector:'header p'},

		headerImageMime:{source:'attribute',selector:'header .image [src]',attribute:'data-mime'},
		headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		headerImageSrcset:{source:'attribute',selector:'header .image [src]',attribute:'srcset'},
		headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},
		
		headerBackgroundImageMime:{source:'attribute',selector:'header .background [src]',attribute:'data-mime'},
		headerBackgroundImageSrc:{source:'attribute',selector:'header .background [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		headerBackgroundImageSrcset:{source:'attribute',selector:'header .background [src]',attribute:'srcset'},
		headerBackgroundImageAlt:{source:'attribute',selector:'header .background [src]',attribute:'alt'},

		imageMime:{source:'attribute',selector:'.image [src]',attribute:'data-mime'},
		imageSrc:{source:'attribute',selector:'.image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		imageSrcset:{source:'attribute',selector:'.image [src]',attribute:'srcset'},
		imageAlt:{source:'attribute',selector:'.image [src]',attribute:'alt'},

		backgroundImageSrc:{source:'attribute',selector:'.wp-block-catpow-section>.background [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		backgroundImageSrcset:{source:'attribute',selector:'.wp-block-catpow-section>.background [src]',attribute:'srcset'},
	},
	example:CP.example,
	edit({attributes,className,setAttributes}){
        const {id,classes,prefix,title,headerImageMime,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageMime,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;
		const primaryClass='wp-block-catpow-section';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
		var states=CP.wordsToFlags(classes);
		
		const imageKeys={
			icon:{src:"icon"},
			image:{mime:"imageMime",src:"imageSrc",alt:"imageAlt",srcset:"imageSrcset"},
			headerImage:{mime:"headerImageMime",src:"headerImageSrc",alt:"headerImageAlt",srcset:"headerImageSrcset"},
			headerBackgroundImage:{mime:"headerBackgroundImageMime",src:"headerBackgroundImageSrc",alt:"headerBackgroundImageAlt",srcset:"headerBackgroundImageSrcset"},
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset"}
		};
		const imageSizes={
			image:'medium',
			headerImage:'medium_large'
		};
		
		const selectiveClasses=[
			{
				label:'タイプ',
				filter:'type',
				values:[
					'scene',
					'article',
					'column'
				],
				sub:{
					scene:[
						'color',
						'pattern',
						{label:'プレフィクス',values:'hasPrefix'},
						{label:'ヘッダ画像',values:'hasHeaderImage',sub:[
							{input:'image',keys:imageKeys.headerImage,size:imageSizes.headerImage}
						]},
						{label:'ヘッダ背景画像',values:'hasHeaderBackgroundImage',sub:[
							{input:'image',label:'PC版背景画像',keys:imageKeys.headerBackgroundImage},
							{input:'image',label:'SP版背景画像',keys:imageKeys.headerBackgroundImage,ofSP:true,sizes:'480px'},
							{label:'薄く',values:'paleHeaderBG'}
						]},
						{label:'抜き色文字',values:'inverseText',sub:[
							{label:'ヘッダ背景色',values:'hasHeaderBackgroundColor'}
						]},
						{label:'リード',values:'hasRead'},
						{label:'背景画像',values:'hasBackgroundImage',sub:[
							{input:'image',label:'PC版背景画像',keys:imageKeys.backgroundImage},
							{input:'image',label:'SP版背景画像',keys:imageKeys.backgroundImage,ofSP:true,sizes:'480px'},
							{label:'薄く',values:'paleBG'}
						]},
						{label:'背景色',values:'hasBackgroundColor'},
						{label:'メニューアイコン',values:'hasNavIcon',sub:[
							{input:'image',label:'アイコン',keys:imageKeys.icon,size:'thumbnail'}
						]},
						{
							label:'テンプレート',
							values:'isTemplate',
							sub:[
								{label:'ヘッダ画像',values:'hasHeaderImage',sub:[
									{input:'text',key:'headerImageSrc'}
								]},
								{label:'ヘッダ背景画像',values:'hasHeaderBackgroundImage',sub:[
									{input:'text',key:'headerBackgroundImageSrc'},
								]},
								{label:'背景画像',values:'hasBackgroundImage',sub:[
									{input:'text',key:'backgroundImageSrc'},
								]},
							]
						}
					],
					article:[
						'color',
						{label:'レベル',values:{level2:'2',level3:'3',level4:'4'}},
						{label:'見出しタイプ',filter:'heading_type',values:{header:'ヘッダ',headline:'ヘッドライン',catch:'キャッチ'}},
						{label:'ヘッダ画像',values:'hasHeaderImage',sub:[
							{input:'image',keys:imageKeys.headerImage,size:imageSizes.headerImage}
						]},
						{label:'リード',values:'hasRead'},
						{label:'背景画像',values:'hasBackgroundImage',sub:[
							{input:'image',label:'PC版背景画像',keys:imageKeys.backgroundImage},
							{input:'image',label:'SP版背景画像',keys:imageKeys.backgroundImage,ofSP:true,sizes:'480px'},
							{label:'薄く',values:'paleBG'}
						]},
						{label:'背景色',values:'hasBackgroundColor'},
						{label:'メニューアイコン',values:'hasNavIcon',sub:[
							{input:'image',label:'アイコン',keys:imageKeys.icon,size:'thumbnail'}
						]},
						{
							label:'テンプレート',
							values:'isTemplate',
							sub:[
								{label:'ヘッダ画像',values:'hasHeaderImage',sub:[
									{input:'text',key:'headerImageSrc'}
								]},
								{label:'背景画像',values:'hasBackgroundImage',sub:[
									{input:'text',key:'backgroundImageSrc'},
								]},
							]
						}
					],
					column:[
						'color',
						'pattern',
						{label:'アイコン',values:'hasIcon',sub:[
							{label:'種類',values:['check','help','alert','caution','warn']}
						]},
						{label:'画像',values:'hasImage',sub:[
							{input:'image',keys:imageKeys.image}
						]},
						{label:'背景画像',values:'hasBackgroundImage',sub:[
							{input:'image',label:'PC版背景画像',keys:imageKeys.backgroundImage},
							{input:'image',label:'SP版背景画像',keys:imageKeys.backgroundImage,ofSP:true,sizes:'480px'},
							{label:'薄く',values:'paleBG'}
						]},
						{label:'線',values:{no_border:'なし',thin_border:'細',bold_border:'太'}},
						{label:'角丸',values:'round'},
						{label:'影',values:'shadow',sub:[{label:'内側',values:'inset'}]},
						{label:'メニューアイコン',values:'hasNavIcon',sub:[
							{input:'image',label:'アイコン',keys:imageKeys.icon,size:'thumbnail'}
						]},
						{
							label:'テンプレート',
							values:'isTemplate',
							sub:[
								{label:'画像',values:'hasImage',sub:[
									{input:'text',key:'imageSrc'}
								]},
								{label:'背景画像',values:'hasBackgroundImage',sub:[
									{input:'text',key:'backgroundImageSrc'},
								]},
							]
						}
					]
				},
				bind:{
					scene:['level1'],
					column:['level3']
				}
			}
		];
		
		var level=CP.getNumberClass({attr:attributes},'level');
		
		
        return [
			<BlockControls>
				<AlignClassToolbar set={setAttributes} attr={attributes}/>
			</BlockControls>,
			<section id={id} className={classArray.join(' ')}>
				{states.hasImage && 
					<div class="image">
						<SelectResponsiveImage
							attr={attributes}
							set={setAttributes}
							keys={imageKeys.image}
							size={imageSizes.image}
						/>
					</div>
				}
				<div class='contents'>
					<header>
						<div class="title">
							{states.hasPrefix && 
								<div class="prefix">
									<RichText tagName="div" value={prefix} onChange={(prefix)=>setAttributes({prefix:prefix})}/>
								</div>
							}
							{states.hasHeaderImage &&
								<div class="image">
									<SelectResponsiveImage
										set={setAttributes}
										attr={attributes}
										keys={imageKeys.headerImage}
										size={imageSizes.headerImage}
									/>
								</div>
							}
							{el('h'+level,{className:'heading'},<RichText tagName="div" value={title} onChange={(title)=>setAttributes({title:title})}/>)}
							{states.hasRead && 
								<p><RichText tagName="div" value={read} onChange={(read)=>setAttributes({read:read})}/></p>
							}
						</div>
						
						{states.hasHeaderBackgroundImage && 
							<div class="background">
								<SelectResponsiveImage
									set={setAttributes}
									attr={attributes}
									keys={imageKeys.headerBackgroundImage}
								/>
							</div>
						}
					</header>
					<div class="text"><InnerBlocks/></div>
				</div>
				{states.hasBackgroundImage && 
					<div class="background">
						<SelectResponsiveImage
							set={setAttributes}
							attr={attributes}
							keys={imageKeys.backgroundImage}
						/>
					</div>
				}
			</section>,
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
					filters={CP.filters.section || {}}
				/>
				<PanelBody title="ID" icon="admin-links" initialOpen={false}>
					<TextControl
						label='ID'
						onChange={(id)=>{setAttributes({id:id});}}
						value={id}
					/>
				</PanelBody>
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
        const {id,icon,classes,prefix,title,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;
		
		var states=CP.wordsToFlags(classes);
		var level=CP.getNumberClass({attr:attributes},'level');
		
		const imageKeys={
			icon:{src:"icon"},
			image:{mime:"imageMime",src:"imageSrc",alt:"imageAlt",srcset:"imageSrcset"},
			headerImage:{mime:"headerImageMime",src:"headerImageSrc",alt:"headerImageAlt",srcset:"headerImageSrcset"},
			headerBackgroundImage:{mime:"headerBackgroundImageMime",src:"headerBackgroundImageSrc",alt:"headerBackgroundImageAlt",srcset:"headerBackgroundImageSrcset"},
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset"}
		};
		
		return (
			<section id={id} className={classes} data-icon={icon}>
				{states.hasImage && 
					<div class="image">
						<ResponsiveImage
							attr={attributes}
							keys={imageKeys.image}
							size='medium_large'
						/>
					</div>
				}
				<div class="contents">
					<header>
						<div class="title">
							{states.hasPrefix && 
								<div class="prefix">{prefix}</div>
							}
							{states.hasHeaderImage &&
								<div class="image">
									<ResponsiveImage
										attr={attributes}
										keys={imageKeys.headerImage}
									/>
								</div>
							}
							{el('h'+level,{className:'heading'},title)}
							{states.hasRead && <p>{read}</p>}
						</div>
						{states.hasHeaderBackgroundImage &&
							<div class="background">
								<ResponsiveImage
									attr={attributes}
									keys={imageKeys.headerBackgroundImage}
								/>
							</div>
						}
					</header>
					<div class="text"><InnerBlocks.Content/></div>
				</div>
				{states.hasBackgroundImage && 
					<div class="background">
						<ResponsiveImage
							attr={attributes}
							keys={imageKeys.backgroundImage}
						/>
					</div>
				}
			</section>
		);
	}
});