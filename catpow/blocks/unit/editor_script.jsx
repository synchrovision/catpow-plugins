registerBlockType('catpow/unit',{
	title:'🐾 Unit',
	icon:'id',
	category:'catpow',
	attributes:{
		classes:{source:'attribute',selector:'div',attribute:'class',default:'wp-block-catpow-unit left mediumImage'},
		mime:{source:'attribute',selector:'figure img',attribute:'data-mime'},
		src:{source:'attribute',selector:'figure img',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		srcset:{source:'attribute',selector:'figure img',attribute:'srcset'},
		alt:{source:'attribute',selector:'figure img',attribute:'alt',default:''},
		caption:{source:'text',selector:'figure figcaption',attribute:'alt',default:''}
	},
	edit({attributes,className,setAttributes}){
		const {classes,src,alt,caption}=attributes;
		const primaryClass='wp-block-catpow-unit';
		
		const imageKeys={
			image:{mime:"mime",src:"src",alt:"alt",srcset:"srcset"},
		}
		const imageSizes={
			image:'medium_large'
		}
		const selectiveClasses=[
			{label:'画像位置',values:{left:'左',right:'右'}},
			{label:'画像サイズ',values:{largeImage:'大',mediumImage:'中',smallImage:'小'}}
		];
		
		return [
			<div className={classes}>
				<figure className="image">
					<SelectResponsiveImage
						attr={attributes}
						set={setAttributes}
						keys={imageKeys.image}
						size={imageSizes.image}
					/>
					<figcaption><TextControl onChange={(caption)=>setAttributes({caption:caption})} value={caption}/></figcaption>
				</figure>
				<div className='content'><InnerBlocks/></div>
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
						onChange={(classes)=>setAttributes({classes:classes})}
						value={classes}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },
	save({attributes,className,setAttributes}){
		const {classes,src,alt,caption}=attributes;
		const imageKeys={
			image:{mime:"mime",src:"src",alt:"alt",srcset:"srcset"},
		}
		return (
			<div className={classes}>
				<figure className="image">
					<ResponsiveImage
						attr={attributes}
						keys={imageKeys.image}
					/>
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
				<div className='content'><InnerBlocks.Content/></div>
			</div>
		);
	},
	
	deprecated:[
		{
			attributes:{
				classes:{source:'attribute',selector:'div',attribute:'class',default:''},
				src:{source:'attribute',selector:'figure img',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				alt:{source:'attribute',selector:'figure img',attribute:'alt',default:''},
				caption:{source:'text',selector:'figure figcaption',attribute:'alt',default:''}
			},
			save({attributes,className,setAttributes}){
				const {classes,src,alt,caption}=attributes;
				return (
					<div className={classes}>
						<figure className="image">
							<img src={src} alt={alt}/>
							{caption && <figcaption>{caption}</figcaption>}
						</figure>
						<div className='content'><InnerBlocks.Content/></div>
					</div>
				);
			},
		}
	]
});