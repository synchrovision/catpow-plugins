﻿registerBlockType('catpow/section',{
	title: '🐾 Section',
	description:'見出しと本文のセット',
	icon: 'id-alt',
	category: 'catpow',
	attributes:{
		id:{source:'attribute',selector:'section',attribute:'id'},
		classes:{source:'attribute',selector:'section',attribute:'class',default:'wp-block-catpow-section article level3 center catch'},

		prefix:{source:'children',selector:'header div.prefix'},
		title:{type:'array',source:'children',selector:'header h2',default:['Title']},
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
	edit({attributes,className,setAttributes}){
        const {id,classes,prefix,title,headerImageMime,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageMime,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;
		const primaryClass='wp-block-catpow-section';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
		var states={
			hasPrefix:false,
			hasHeaderImage:false,
			hasHeaderBackgroundImage:false,
			hasRead:false,
			hasImage:false,
			hasBackgroundImage:false
		}
		
		const imageKeys={
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
			{label:'タイプ',values:[
				'scene',
				'article',
				'column'
			],sub:{
				scene:[
					'color',
					'pattern',
					{label:'プレフィクス',values:'hasPrefix'},
					{label:'ヘッダ画像',values:'hasHeaderImage',sub:[
						{input:'image',keys:imageKeys.headerImage,size:imageSizes.headerImage}
					]},
					{label:'ヘッダ背景画像',values:'hasHeaderBackgroundImage',sub:[
						{input:'image',keys:imageKeys.headerBackgroundImage},
						{label:'薄く',values:'paleHeaderBG'}
					]},
					{label:'抜き色文字',values:'inverseText',sub:[
						{label:'ヘッダ背景色',values:'hasHeaderBackgroundColor'}
					]},
					{label:'リード',values:'hasRead'},
					{label:'背景画像',values:'hasBackgroundImage',sub:[
						{input:'image',keys:imageKeys.backgroundImage},
						{label:'薄く',values:'paleBG'}
					]},
					{label:'背景色',values:'hasBackgroundColor'}
				],
				article:[
					'color',
					{label:'レベル',values:{level1:'1',level2:'2',level3:'3',level4:'4',level5:'5',level6:'6'}},
					{label:'見出しタイプ',values:{header:'ヘッダ',headline:'ヘッドライン',catch:'キャッチ'}},
					{label:'リード',values:'hasRead'},
					{label:'背景画像',values:'hasBackgroundImage',sub:[
						{input:'image',keys:imageKeys.backgroundImage},
						{label:'薄く',values:'paleBG'}
					]},
					{label:'背景色',values:'hasBackgroundColor'}
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
						{input:'image',keys:imageKeys.backgroundImage},
						{label:'薄く',values:'paleBG'}
					]},
					{label:'線',values:{no_border:'なし',thin_border:'細',bold_border:'太'}},
					{label:'角丸',values:'round'},
					{label:'影',values:'shadow',sub:[{label:'内側',values:'inset'}]}
				]
			}}
		];
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		
		
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
							<h2><RichText tagName="div" value={title} onChange={(title)=>setAttributes({title:title})}/></h2>
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
        const {id,classes,prefix,title,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;
		
		
		var classArray=classes.split(' ');
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		
		var hasPrefix=hasClass('hasPrefix');
		var hasHeaderImage=hasClass('hasHeaderImage');
		var hasHeaderBackgroundImage=hasClass('hasHeaderBackgroundImage');
		var hasRead=hasClass('hasRead');
		var hasImage=hasClass('hasImage');
		var hasBackgroundImage=hasClass('hasBackgroundImage');
		
		const imageKeys={
			image:{mime:"imageMime",src:"imageSrc",alt:"imageAlt",srcset:"imageSrcset"},
			headerImage:{mime:"headerImageMime",src:"headerImageSrc",alt:"headerImageAlt",srcset:"headerImageSrcset"},
			headerBackgroundImage:{mime:"headerBackgroundImageMime",src:"headerBackgroundImageSrc",alt:"headerBackgroundImageAlt",srcset:"headerBackgroundImageSrcset"},
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset"}
		};
		
		return (
			<section id={id} className={classes}>
				{hasImage && 
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
							{hasPrefix && 
								<div class="prefix">{prefix}</div>
							}
							{hasHeaderImage &&
								<div class="image">
									<ResponsiveImage
										attr={attributes}
										keys={imageKeys.headerImage}
									/>
								</div>
							}
							<h2>{title}</h2>
							{hasRead && <p>{read}</p>}
						</div>
						{hasHeaderBackgroundImage &&
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
				{hasBackgroundImage && 
					<div class="background">
						<ResponsiveImage
							attr={attributes}
							keys={imageKeys.backgroundImage}
						/>
					</div>
				}
			</section>
		);
	},
	
	deprecated:[
		{
			attributes:{
				id:{source:'attribute',selector:'section',attribute:'id'},
				classes:{source:'attribute',selector:'section',attribute:'class',default:''},

				prefix:{source:'children',selector:'header div.prefix'},
				title:{type:'array',source:'children',selector:'header h2',default:['Title']},
				read:{type:'array',source:'children',selector:'header p'},

				headerImageMime:{source:'attribute',selector:'header .image [src]',attribute:'data-mime'},
				headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				headerImageSrcset:{source:'attribute',selector:'header .image [src]',attribute:'srcset'},
				headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},

				imageMime:{source:'attribute',selector:'.image [src]',attribute:'data-mime'},
				imageSrc:{source:'attribute',selector:'.image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				imageSrcset:{source:'attribute',selector:'.image [src]',attribute:'srcset'},
				imageAlt:{source:'attribute',selector:'.image [src]',attribute:'alt'},

				backgroundImageSrc:{source:'attribute',selector:'.background [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'}
			},
			save({attributes,className,setAttributes}){
				const {id,classes,prefix,title,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;


				var classArray=classes.split(' ');
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);

				var hasPrefix=hasClass('hasPrefix');
				var hasHeaderImage=hasClass('hasHeaderImage');
				var hasRead=hasClass('hasRead');
				var hasImage=hasClass('hasImage');
				var hasBackgroundImage=hasClass('hasBackgroundImage');

				const imageKeys={
					image:{mime:"imageMime",src:"imageSrc",alt:"imageAlt",srcset:"imageSrcset"},
					headerImage:{mime:"headerImageMime",src:"headerImageSrc",alt:"headerImageAlt",srcset:"headerImageSrcset"},
					backgroundImage:{src:"backgroundImageSrc"}
				};

				return (
					<section id={id} className={classes}>
						{hasImage && 
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
								{hasPrefix && 
									<div class="prefix">{prefix}</div>
								}
								{hasHeaderImage &&
									<div class="image">
										<ResponsiveImage
											attr={attributes}
											keys={imageKeys.headerImage}
										/>
									</div>
								}
								<h2>{title}</h2>
								{hasRead && <p>{read}</p>}
							</header>
							<div class="text"><InnerBlocks.Content/></div>
						</div>
						{hasBackgroundImage && 
							<div class="background">
								<ResponsiveImage
									attr={attributes}
									keys={imageKeys.backgroundImage}
								/>
							</div>
						}
					</section>
				);
			},
		},
		{
			attributes:{
				id:{source:'attribute',selector:'section',attribute:'id'},
				classes:{source:'attribute',selector:'section',attribute:'class',default:''},

				prefix:{source:'children',selector:'header div.prefix'},
				title:{type:'array',source:'children',selector:'header h2',default:['Title']},
				read:{type:'array',source:'children',selector:'header p'},

				headerImageMime:{source:'attribute',selector:'header .image [src]',attribute:'data-mime'},
				headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				headerImageSrcset:{source:'attribute',selector:'header .image [src]',attribute:'srcset'},
				headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},

				imageMime:{source:'attribute',selector:'.image [src]',attribute:'data-mime'},
				imageSrc:{source:'attribute',selector:'.image [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				imageSrcset:{source:'attribute',selector:'.image [src]',attribute:'srcset'},
				imageAlt:{source:'attribute',selector:'.image [src]',attribute:'alt'},

				backgroundImageSrc:{type:'string',default:cp.theme_url+'/images/dummy.jpg'},
			},
			save({attributes,className,setAttributes}){
				const {id,classes,prefix,title,headerImageSrc,headerImageSrcset,headerImageAlt,read,imageSrc,imageSrcset,imageAlt,backgroundImageSrc}=attributes;


				var classArray=classes.split(' ');
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);

				var hasPrefix=hasClass('hasPrefix');
				var hasHeaderImage=hasClass('hasHeaderImage');
				var hasRead=hasClass('hasRead');
				var hasImage=hasClass('hasImage');
				var hasBackgroundImage=hasClass('hasBackgroundImage');

				var sectionStyle={};
				if(hasBackgroundImage){sectionStyle.backgroundImage=`url('${backgroundImageSrc}')`;}

				const imageKeys={
					image:{mime:"imageMime",src:"imageSrc",alt:"imageAlt",srcset:"imageSrcset"},
					headerImage:{mime:"headerImageMime",src:"headerImageSrc",alt:"headerImageAlt",srcset:"headerImageSrcset"},
					backgroundImage:{src:"backgroundImageSrc"}
				};


				return (
					<section id={id} className={classes} style={sectionStyle}>
						{hasImage && 
							<div class="image">
								<ResponsiveImage
									attr={attributes}
									keys={imageKeys.image}
								/>
							</div>
						}
						<div class="contents">
							<header>
								{hasPrefix && 
									<div class="prefix">{prefix}</div>
								}
								{hasHeaderImage &&
									<div class="image">
										<ResponsiveImage
											attr={attributes}
											keys={imageKeys.headerImage}
										/>
									</div>
								}
								<h2>{title}</h2>
								{hasRead && <p>{read}</p>}
							</header>
							<div class="text"><InnerBlocks.Content/></div>
						</div>
					</section>
				);
			},
			
		}
	]
});