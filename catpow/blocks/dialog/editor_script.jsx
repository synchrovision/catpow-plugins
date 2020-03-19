registerBlockType('catpow/dialog',{
	title: '🐾 Dialog',
	icon: 'format-chat',
	category: 'catpow',
	transforms:{
		from: [
			{
				type:'block',
				blocks:CP.listedConvertibles,
				transform:(attributes)=>{
					attributes.classes='wp-block-catpow-dialog';
					return createBlock('catpow/dialog',attributes);
				},
			},
		]
	},
	attributes:{
		version:{type:'number',default:0},
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-dialog'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				title:{source:'children',selector:'header .text h3'},
				headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src'},
				headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},
				text:{source:'children',selector:'.contents p'}
			},
			default:[...Array(3)].map(()=>{
				return {
					classes:'item left',
					title:['Title'],
					titleCaption:['Caption'],
					headerImageSrc:cp.theme_url+'/images/dummy.jpg',
					headerImageAlt:'dummy',
					text:['Text']
				}
			})
		}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix}=attributes;
		const primaryClass='wp-block-catpow-dialog';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
		const itemClasses=[
			'color',
			{label:'position',values:['left','right']},
			{label:'type',values:['say','shout','think','whisper']}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		
		let rtn=[];
		const imageKeys={
			headerImage:{src:"headerImageSrc",alt:"headerImageAlt",items:"items"}
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
					isSelected={isSelected}
				>
					<header>
						<div className='image'>
							<SelectResponsiveImage
								attr={attributes}
								set={setAttributes}
								keys={imageKeys.headerImage}
								index={index}
								size='thumbnail'
							/>
						</div>
						<div className='text'>
							<h3>
								<RichText
									onChange={(text)=>{itemsCopy[index].title=text;setAttributes({items:itemsCopy});}}
									value={item.title}
								/>
							</h3>
						</div>
					</header>
					<div class="contents">
						<p>
							<RichText
								onChange={(text)=>{itemsCopy[index].text=text;setAttributes({items:itemsCopy});}}
								value={item.text}
							/>
						</p>
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
							icon: 'edit',
							title: 'EditMode',
							isActive: attributes.EditMode,
							onClick: () => setAttributes({EditMode:!attributes.EditMode})
						}
					]}
				/>
			</BlockControls>,
			<InspectorControls>
				<PanelBody title="CLASS" icon="admin-generic" initialOpen={false}>
					<TextareaControl
						label='クラス'
						onChange={(clss)=>setAttributes({classes:clss})}
						value={classArray.join(' ')}
					/>
				</PanelBody>
				<SelectItemClassPanel
					title='リストアイテム'
					icon='edit'
					set={setAttributes}
					attr={attributes}
					items={itemsCopy}
					index={attributes.currentItemIndex}
					itemClasses={itemClasses}
					filters={CP.filters.dialog || {}}
				/>
				<ItemControlInfoPanel/>
			</InspectorControls>,
			<ul className={attributes.EditMode?(primaryClass+' edit'):classes}>{rtn}</ul>
        ];
    },
	save({attributes,className}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix,linkUrl,linkText}=attributes;
		var classArray=_.uniq(attributes.classes.split(' '));
		
		let rtn=[];
		items.map((item,index)=>{
			rtn.push(
				<li className={item.classes}>
					<header>
						<div class='image'><img src={item.headerImageSrc} alt={item.headerImageAlt}/></div>
						<div className='text'>
							<h3>{item.title}</h3>
						</div>
					</header>
						<div class="contents">
						<p>{item.text}</p>
					</div>
				</li>
			);
		});
		return <ul className={classes}>{rtn}</ul>;
	}
});