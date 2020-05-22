registerBlockType('catpow/listed',{
	title: '🐾 Listed',
	icon: 'editor-ul',
	category: 'catpow',
	transforms:{
		from: [
			{
				type:'block',
				blocks:CP.listedConvertibles,
				transform:(attributes)=>{
					attributes.classes='wp-block-catpow-listed menu medium hasHeader hasTitle hasTitleCaption hasImage hasText';
					return createBlock('catpow/listed',attributes);
				},
			},
		]
	},
	attributes:{
		version:{type:'number',default:0},
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-listed menu medium hasHeader hasTitle hasTitleCaption hasImage hasText'},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				classes:{source:'attribute',attribute:'class'},
				title:{source:'children',selector:'header .text h3'},
				titleCaption:{source:'children',selector:'header .text p'},
				headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src'},
				headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},
				subImageSrc:{source:'attribute',selector:'.contents .image [src]',attribute:'src'},
				subImageAlt:{source:'attribute',selector:'.contents .image [src]',attribute:'alt'},
				src:{source:'attribute',selector:'li>.image [src]',attribute:'src'},
				alt:{source:'attribute',selector:'li>.image [src]',attribute:'alt'},
				subTitle:{source:'children',selector:'.contents h4'},
				text:{source:'children',selector:'.contents p'},
				linkUrl:{source:'attribute',selector:'.link a',attribute:'href'},

				backgroundImageSrc:{source:'attribute',selector:'.background [src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
				backgroundImageSrcset:{source:'attribute',selector:'.background [src]',attribute:'srcset'},
			},
			default:[...Array(3)].map(()=>{
				return {
					classes:'item',
					title:['Title'],
					titleCaption:['Caption'],
					headerImageSrc:cp.theme_url+'/images/dummy.jpg',
					headerImageAlt:'dummy',
					subTitle:['SubTitle'],
					src:cp.theme_url+'/images/dummy.jpg',
					alt:'dummy',
					text:['Text'],
					linkUrl:cp.home_url
				}
			})
		},
		countPrefix:{source:'text',selector:'.counter .prefix',default:''},
		countSuffix:{source:'text',selector:'.counter .suffix',default:''},
		subCountPrefix:{source:'text',selector:'.subcounter .prefix',default:''},
		subCountSuffix:{source:'text',selector:'.subcounter .suffix',default:''},
		loopParam:{type:'text',default:''},
		loopCount:{type:'number',default:1}
	},
	edit({attributes,className,setAttributes,isSelected}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix,loopCount}=attributes;
		const primaryClass='wp-block-catpow-listed';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
		var states=CP.wordsToFlags(classes);
		
        
		var selectiveClasses=[
			{
				label:'タイプ',
				filter:'type',
				values:{
					orderd:'連番リスト',
					news:'お知らせ',
					index:'目次',
					menu:'メニュー'
				},
				sub:{
					orderd:[
						{label:'画像',values:'hasImage'},
						{input:'text',label:'番号前置テキスト',key:'countPrefix'},
						{input:'text',label:'番号後置テキスト',key:'countSuffix'},
						{label:'タイトルキャプション',values:'hasTitleCaption'},
						{label:'サブタイトル',values:'hasSubTitle'},
						{label:'リンク',values:'hasLink'}
					],
					news:[],
					index:[
						{label:'レベル','values':['level0','level1','level2','level3']}
					],
					menu:[
						{label:'サイズ',values:['small','medium','large']},
						{label:'画像',values:{noImage:'なし',hasImage:'大',hasHeaderImage:'小'}},
						{label:'背景画像',values:'hasBackgroundImage',sub:[
							{label:'薄く',values:'paleBG'}
						]},
						{label:'背景色',values:'hasBackgroundColor'},
						{label:'抜き色文字',values:'inverseText'},
						{label:'タイトルキャプション',values:'hasTitleCaption'},
						{label:'テキスト',values:'hasText'},
						{label:'リンク',values:'hasLink'}
					]
				},
                bind:{
                    orderd:['hasHeader','hasCounter','hasTitle','hasText'],
					news:['hasText','hasSubTitle'],
					index:['hasHeader','hasTitle','hasText'],
					menu:['hasHeader','hasTitle']
                },
				item:{
					news:[],
					index:[],
					menu:['color'],
					sphere:['color']
				}
			},
			{
				label:'テンプレート',
				values:'isTemplate',
				sub:[
					{label:'ループ',values:'doLoop',sub:[
						{label:'パラメータ',input:'text',key:'loopParam'},
						{label:'ループ数',input:'range',key:'loopCount',min:1,max:16}
					]}
				]
			}
		];
		const itemTemplateSelectiveClasses=[
			{label:'画像',values:'loopImage',sub:[
				{label:'src',input:'text',key:'src'},
				{label:'alt',input:'text',key:'alt'},
			]},
			{label:'ヘッダ画像',values:'loopHeaderImage',sub:[
				{label:'headerImageSrc',input:'text',key:'headerImageSrc'},
				{label:'headerImageAlt',input:'text',key:'headerImageAlt'},
			]},
			{label:'サブ画像',values:'loopSubImage',sub:[
				{label:'subImageSrc',input:'text',key:'subImageSrc'},
				{label:'subImageAlt',input:'text',key:'subImageAlt'},
			]}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		let rtn=[];
		const imageKeys={
			image:{src:"src",alt:"alt",items:"items"},
			headerImage:{src:"headerImageSrc",alt:"headerImageAlt",items:"items"},
			subImage:{src:"subImageSrc",alt:"subImageAlt",items:"items"},
			backgroundImage:{src:"backgroundImageSrc",srcset:"backgroundImageSrcset",items:"items"},
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
					{states.hasImage &&
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
					{states.hasHeader &&
						<header>
							{states.hasCounter &&
								<div className='counter'>
									{countPrefix && <span class="prefix">{countPrefix}</span>}
									<span className="number">{index+1}</span>
									{countSuffix && <span class="suffix">{countSuffix}</span>}
								</div>
							}
							{states.hasHeaderImage &&
								<div className='image'>
									<SelectResponsiveImage
										attr={attributes}
										set={setAttributes}
										keys={imageKeys.headerImage}
										index={index}
										size='thumbnail'
									/>
								</div>
							}
							<div className='text'>
								{states.hasTitle &&
									<h3>
										<RichText
											onChange={(text)=>{itemsCopy[index].title=text;setAttributes({items:itemsCopy});}}
											value={item.title}
										/>
									</h3>
								}
								{states.hasTitle && states.hasTitleCaption && 
									<p>
										<RichText
											onChange={(text)=>{itemsCopy[index].titleCaption=text;setAttributes({items:itemsCopy});}}
											value={item.titleCaption}
										/>
									</p>
								}
							</div>
						</header>
					}
					{(states.hasSubImage || states.hasSubTitle || states.hasText) && 
						<div class="contents">
							{states.hasSubCounter &&
								<div className='subcounter'>
									{subCountPrefix && <span class="prefix">{subCountPrefix}</span>}
									<span className="number">{index+1}</span>
									{subCountSuffix && <span class="suffix">{subCountSuffix}</span>}
								</div>
							}
							{states.hasSubImage &&
								<div className='image'>
									<SelectResponsiveImage
										attr={attributes}
										set={setAttributes}
										keys={imageKeys.subImage}
										index={index}
										size='medium'
									/>
								</div>
							}
							{states.hasSubTitle &&
								<h4>
									<RichText
										onChange={(subTitle)=>{itemsCopy[index].subTitle=subTitle;setAttributes({items:itemsCopy});}}
										value={item.subTitle}
										placeholder='SubTitle'
									/>
								</h4>
							}
							{states.hasText && 
								<p>
									<RichText
										onChange={(text)=>{itemsCopy[index].text=text;setAttributes({items:itemsCopy});}}
										value={item.text}
									/>
								</p>
							}
						</div>
					}
					{states.hasBackgroundImage &&
						<div className='background'>
							<SelectResponsiveImage
								attr={attributes}
								set={setAttributes}
								keys={imageKeys.backgroundImage}
								index={index}
							/>
						</div>
					}
					{states.hasLink &&
						<div className='link'>
							<TextControl onChange={(linkUrl)=>{
								itemsCopy[index].linkUrl=linkUrl;
								setAttributes({items:itemsCopy});
							}} value={item.linkUrl} placeholder='URLを入力'/>
						</div>
					}
				</Item>
			);
		});
		
		if(attributes.EditMode===undefined){attributes.EditMode=false;}
		if(rtn.length<loopCount){
			let len=rtn.length;
			while(rtn.length<loopCount){
				rtn.push(rtn[rtn.length%len]);
			}
		}
		
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
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
					filters={CP.filters.listed || {}}
				/>
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
					triggerClasses={selectiveClasses[0]}
					filters={CP.filters.listed || {}}
				/>
				{states.isTemplate &&
					<SelectItemClassPanel
						title='テンプレート'
						icon='edit'
						set={setAttributes}
						attr={attributes}
						items={itemsCopy}
						index={attributes.currentItemIndex}
						itemClasses={itemTemplateSelectiveClasses}
						filters={CP.filters.listed || {}}
					/>
				}
				<ItemControlInfoPanel/>
			</InspectorControls>,
			<ul className={attributes.EditMode?(primaryClass+' edit'):classes}>{rtn}</ul>
        ];
    },
	save({attributes,className}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix,linkUrl,linkText,loopParam}=attributes;
		var classArray=_.uniq(attributes.classes.split(' '));
		
		var states=CP.wordsToFlags(classes);
		
		
		let rtn=[];
		items.map((item,index)=>{
			rtn.push(
				<li className={item.classes}>
					{states.hasImage && <div className='image'><img src={item.src} alt={item.alt}/></div>}
					{states.hasHeader &&
						<header>
							{states.hasCounter &&
								<div className='counter'>
									{countPrefix && <span class="prefix">{countPrefix}</span>}
									<span className="number">{index+1}</span>
									{countSuffix && <span class="suffix">{countSuffix}</span>}
								</div>
							}
							{states.hasHeaderImage && <div class='image'><img src={item.headerImageSrc} alt={item.headerImageAlt}/></div>}
							<div className='text'>
								{states.hasTitle && <h3>{item.title}</h3>}
								{states.hasTitle && states.hasTitleCaption && <p>{item.titleCaption}</p>}
							</div>
						</header>
					}
					{(states.hasSubImage || states.hasSubTitle || states.hasText) && 
						<div class="contents">
							{states.hasSubCounter &&
								<div className='subcounter'>
									{subCountPrefix && <span class="prefix">{subCountPrefix}</span>}
									<span className="number">{index+1}</span>
									{subCountSuffix && <span class="suffix">{subCountSuffix}</span>}
								</div>
							}
							{states.hasSubImage && <div className='image'><img src={item.subImageSrc} alt={item.subImageAlt}/></div>}
							{states.hasSubTitle && <h4>{item.subTitle}</h4>}
							{states.hasText && <p>{item.text}</p>}
						</div>
					}
					{states.hasBackgroundImage && 
						<div className='background'>
							<img src={item.backgroundImageSrc} srcset={item.backgroundImageSrcset}/>
						</div>
					}
					{states.hasLink && item.linkUrl && <div className='link'><a href={item.linkUrl}> </a></div>}
				</li>
			);
		});
		return (
			<ul className={classes}>
				{states.doLoop && '[loop '+(loopParam || '')+']'}
				{rtn}
				{states.doLoop && '[/loop]'}
			</ul>
		);
	},
});