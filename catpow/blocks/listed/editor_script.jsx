registerBlockType('catpow/listed',{
	title: '🐾 Listed',
	icon: 'editor-ul',
	category: 'catpow',
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
		spacer:{type:'int',default:0}
	},
	edit({attributes,className,setAttributes}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix,spacer,dummy_image_url}=attributes;
		const primaryClass='wp-block-catpow-listed';
		var classArray=_.uniq((className+' '+classes).split(' '));
		var classNameArray=className.split(' ');
		
		var states={
			hasHeader:false,
			hasHeaderImage:false,
			hasCounter:false,
			hasTitle:false,
			hasTitleCaption:false,
			hasSubImage:false,
			hasSubTitle:false,
			hasSubCounter:false,
			hasText:false,
			hasImage:false,
			hasLink:false,
			hasBackgroundImage:false
		}
		
        
		var selectiveClasses=[
			{
				label:'タイプ',
				values:{
					flowchart:'フロー',
					faq:'Q&A',
					ranking:'ランキング',
					orderd:'連番リスト',
					dialog:'会話',
					news:'お知らせ',
					index:'目次',
					menu:'メニュー',
					sphere:'円',
				},
				sub:{
					flowchart:[
						{label:'番号',values:'hasCounter',sub:[
							{input:'text',label:'番号前置テキスト',key:'countPrefix'},
							{input:'text',label:'番号後置テキスト',key:'countSuffix'},
						]},
						{label:'画像',values:'hasImage'},
						{label:'タイトルキャプション',values:'hasTitleCaption'},
						{label:'サブタイトル',values:'hasSubTitle'},
						{label:'サイズ',values:['small','medium','large']},
						{label:'リンク',values:'hasLink'}
					],
					faq:[
						{label:'Qにキャプション',values:'hasTitleCaption'},
						{label:'Aに見出し',values:'hasSubTitle'},
						{label:'アコーディオン',values:'accordion'},
						{label:'リンク',values:'hasLink'}
					],
					ranking:[
						{label:'画像',values:'hasImage'},
						{label:'タイトルキャプション',values:'hasTitleCaption'},
						{label:'サブタイトル',values:'hasSubTitle'},
						{label:'リンク',values:'hasLink'}
					],
					orderd:[
						{label:'画像',values:'hasImage'},
						{input:'text',label:'番号前置テキスト',key:'countPrefix'},
						{input:'text',label:'番号後置テキスト',key:'countSuffix'},
						{label:'タイトルキャプション',values:'hasTitleCaption'},
						{label:'サブタイトル',values:'hasSubTitle'},
						{label:'リンク',values:'hasLink'}
					],
					dialog:[],
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
					],
					sphere:[
						{label:'サイズ',values:['small','medium','large']},
						{label:'画像',values:'hasSubImage'},
						{label:'タイトル',values:'hasSubTitle'},
						{label:'テキスト',values:'hasText'}
					]
				},
                bind:{
					flowchart:['hasHeader','hasTitle','hasText'],
                    faq:['hasHeader','hasTitle','hasText'],
                    ranking:['hasHeader','hasTitle','hasText'],
                    orderd:['hasHeader','hasCounter','hasTitle','hasText'],
					dialog:['hasHeader','hasHeaderImage','hasTitle','hasText'],
					news:['hasText','hasSubTitle'],
					index:['hasHeader','hasTitle','hasText'],
					menu:['hasHeader','hasTitle'],
                },
				item:{
					flowchart:[],
					dialog:[
						'color',
						{label:'position',values:['left','right']},
						{label:'type',values:['say','shout','think','whisper']}
					],
					news:[],
					index:[],
					menu:['color'],
					sphere:['color'],
				}
			}
		];
		
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
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
				<Item tag='li' set={setAttributes} items={itemsCopy} index={index}>
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
			<ul className={attributes.EditMode?(primaryClass+' edit'):classes}>{rtn}</ul>,
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
			</InspectorControls>
        ];
    },
	save({attributes,className}){
		const {items,classes,countPrefix,countSuffix,subCountPrefix,subCountSuffix,linkUrl,linkText,spacer}=attributes;
		var classArray=_.uniq(attributes.classes.split(' '));
		
		var states={
			hasHeader:false,
			hasHeaderImage:false,
			hasCounter:false,
			hasTitle:false,
			hasTitleCaption:false,
			hasSubImage:false,
			hasSubTitle:false,
			hasSubCounter:false,
			hasText:false,
			hasImage:false,
			hasLink:false,
			hasBackgroundImage:false
		}
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
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
		for(let i=0;i<spacer;i++){rtn.push(<li className="spacer"></li>);}
		return <ul className={classes}>{rtn}</ul>;
	},
	
	deprecated:[
		{
			attributes:{
				version:{type:'number',default:0},
				classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-listed menu hasHeader hasTitle hasImage'},
				items:{
					source:'query',
					selector:'li.item',
					query:{
						classes:{source:'attribute',attribute:'class'},
						title:{source:'children',selector:'header .text h3'},
						titleCaption:{source:'children',selector:'header .text p'},
						headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src'},
						headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},
						src:{source:'attribute',selector:'.contents .image [src]',attribute:'src'},
						alt:{source:'attribute',selector:'.contents .image [src]',attribute:'alt'},
						subTitle:{source:'children',selector:'.text h4'},
						text:{source:'children',selector:'.text p'},
						linkUrl:{source:'attribute',selector:'.text .link a',attribute:'href'},

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
							linkUrl:cp.home_url,
							linkText:'もっと詳しく'
						}
					})
				},
				countPrefix:{source:'text',selector:'.counter .prefix',default:''},
				countSuffix:{source:'text',selector:'.counter .suffix',default:''},
				spacer:{type:'int',default:0}
			},
			save({attributes,className}){
				const {items,classes,countPrefix,countSuffix,linkUrl,linkText,spacer}=attributes;
				var classArray=_.uniq(attributes.classes.split(' '));

				var states={
					hasHeader:false,
					hasHeaderImage:false,
					hasCounter:false,
					hasTitle:false,
					hasTitleCaption:false,
					hasSubTitle:false,
					hasImage:false,
					hasLink:false,
					hasBackgroundImage:false
				}
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
				Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);

				let rtn=[];
				items.map((item,index)=>{
					rtn.push(
						<li className={item.classes}>
							{states.hasHeader &&
								<header>
									{states.hasHeaderImage && <div class='image'><img src={item.headerImageSrc} alt={item.headerImageAlt}/></div>}
									<div className='text'>
										{states.hasCounter &&
											<div className='counter'>
												{countPrefix && <span class="prefix">{countPrefix}</span>}
												<span className="number">{index+1}</span>
												{countSuffix && <span class="suffix">{countSuffix}</span>}
											</div>
										}
										{states.hasTitle && <h3>{item.title}</h3>}
										{states.hasTitle && states.hasTitleCaption && <p>{item.titleCaption}</p>}
									</div>
								</header>
							}
							<div class="contents">
								{states.hasImage && <div className='image'><img src={item.src} alt={item.alt}/></div>}
								<div class="text">
									{states.hasSubTitle && <h4>{item.subTitle}</h4>}
									<p>{item.text}</p>
								</div>
							</div>
							{states.hasBackgroundImage && 
								<div className='background'>
									<img src={item.backgroundImageSrc} srcset={item.backgroundImageSrcset}/>
								</div>
							}
							{states.hasLink && <div className='link'><a href={item.linkUrl}> </a></div>}
						</li>
					);
				});
				for(let i=0;i<spacer;i++){rtn.push(<li className="spacer"></li>);}
				return <ul className={classes}>{rtn}</ul>;
			},
			migrate(attributes){
				attributes.classes+=' hasText';
				return attributes;
			}
		},
		{
			attributes:{
				version:{type:'number',default:0},
				classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-listed menu hasHeader hasTitle hasImage'},
				items:{
					source:'query',
					selector:'li.item',
					query:{
						classes:{source:'attribute',attribute:'class'},
						title:{source:'children',selector:'header .text h3'},
						titleCaption:{source:'children',selector:'header .text p'},
						headerImageSrc:{source:'attribute',selector:'header .image [src]',attribute:'src'},
						headerImageAlt:{source:'attribute',selector:'header .image [src]',attribute:'alt'},
						src:{source:'attribute',selector:'.image [src]',attribute:'src'},
						alt:{source:'attribute',selector:'.image [src]',attribute:'alt'},
						subTitle:{source:'children',selector:'.text h4'},
						text:{source:'children',selector:'.text p'},
						linkUrl:{source:'attribute',selector:'.text .link a',attribute:'href'},

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
							linkUrl:cp.home_url,
							linkText:'もっと詳しく'
						}
					})
				},
				countPrefix:{source:'text',selector:'.counter .prefix',default:''},
				countSuffix:{source:'text',selector:'.counter .suffix',default:''},
				spacer:{type:'int',default:0}
			},
			save({attributes,className}){
				const {items,classes,countPrefix,countSuffix,linkUrl,linkText,spacer}=attributes;
				var classArray=_.uniq(attributes.classes.split(' '));

				var states={
					hasHeader:false,
					hasHeaderImage:false,
					hasCounter:false,
					hasTitle:false,
					hasTitleCaption:false,
					hasSubTitle:false,
					hasImage:false,
					hasLink:false,
					hasBackgroundImage:false
				}
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
				Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);

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
							<div class="text">
								{states.hasSubTitle && <h4>{item.subTitle}</h4>}
								<p>{item.text}</p>
							</div>
							{states.hasBackgroundImage && 
								<div className='background'>
									<img src={item.backgroundImageSrc} srcset={item.backgroundImageSrcset}/>
								</div>
							}
							{states.hasLink && <div className='link'><a href={item.linkUrl}> </a></div>}
						</li>
					);
				});
				for(let i=0;i<spacer;i++){rtn.push(<li className="spacer"></li>);}
				return <ul className={classes}>{rtn}</ul>;
			},
			migrate(attributes){
				attributes.classes+=' hasText';
				return attributes;
			}
		},
		{
			attributes:{
				version:{type:'number',default:0},
				classes:{source:'attribute',selector:'ul',attribute:'class',default:'hasTitle'},
				items:{
					source:'query',
					selector:'li.item',
					query:{
						classes:{source:'attribute',attribute:'class'},
						title:{source:'children',selector:'header h3'},
						titleCaption:{source:'children',selector:'header p'},
						src:{source:'attribute',selector:'.contents .image [src]',attribute:'src'},
						alt:{source:'attribute',selector:'.contents .image [src]',attribute:'alt'},
						subTitle:{source:'children',selector:'.contents .text h4'},
						text:{source:'children',selector:'.contents .text p'},
						linkUrl:{source:'attribute',selector:'.contents .text .link a',attribute:'href'},
						linkText:{source:'text',selector:'.contents .text .link a'},
					}
				},
				countPrefix:{source:'text',selector:'.counter .prefix',default:''},
				countSuffix:{source:'text',selector:'.counter .suffix',default:''},
				spacer:{type:'int',default:0}
			},
			save({attributes,className}){
				
				const {version,items,classes,countPrefix,countSuffix,linkUrl,linkText,spacer}=attributes;
				var classArray=_.uniq(attributes.classes.split(' '));
				var states={
					hasHeader:false,
					hasCounter:false,
					hasTitle:false,
					hasTitleCaption:false,
					hasSubTitle:false,
					hasImage:false,
					hasLink:false,
					hasBackgroundImage:false
				}
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
				Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);

				let rtn=[];
				items.map((item,index)=>{
					rtn.push(
						<li className={item.classes}>
							{states.hasHeader &&
								<header>
									{states.hasCounter &&
										<div className='counter'>
											{countPrefix && <span class="prefix">{countPrefix}</span>}
											<span className="number">{index+1}</span>
											{countSuffix && <span class="suffix">{countSuffix}</span>}
										</div>
									}
									{states.hasTitle && <h3>{item.title}</h3>}
									{states.hasTitle && states.hasTitleCaption && <p>{item.titleCaption}</p>}
								</header>
							}
							<div class="contents">
								{states.hasImage && <div className='image'><img src={item.src} alt={item.alt}/></div>}
								<div class="text">
									{states.hasSubTitle && <h4>{item.subTitle}</h4>}
									<p>{item.text}</p>
									{states.hasLink && <div className='link'><a href={item.linkUrl}>{item.linkText}</a></div>}
								</div>
							</div>
						</li>
					);
				});
				for(let i=0;i<spacer;i++){rtn.push(<li className="spacer"></li>);}
				return <ul className={classes}>{rtn}</ul>;
			},
			migrate(attributes){
				attributes.classes+=' hasText';
				return attributes;
			}
		},
		{
			attributes:{
				version:{type:'number',default:0},
				classes:{source:'attribute',selector:'ul',attribute:'class',default:'hasTitle'},
				items:{
					source:'query',
					selector:'li.item',
					query:{
						classes:{source:'attribute',attribute:'class'},
						title:{source:'children',selector:'h3'},
						src:{source:'attribute',selector:'.contents .image [src]',attribute:'src'},
						alt:{source:'attribute',selector:'.contents .image [src]',attribute:'alt'},
						subTitle:{source:'children',selector:'.contents .text h4'},
						text:{source:'children',selector:'.contents .text p'},
						linkUrl:{source:'attribute',selector:'.contents .text .link a',attribute:'href'},
						linkText:{source:'text',selector:'.contents .text .link a'},
					}
				},
				countPrefix:{source:'text',selector:'.counter .prefix',default:''},
				countSuffix:{source:'text',selector:'.counter .suffix',default:''},
				spacer:{type:'int',default:0}
			},
			save({attributes,className}){
				
				const {version,items,classes,countPrefix,countSuffix,linkUrl,linkText,spacer}=attributes;
				var classArray=_.uniq(attributes.classes.split(' '));
				var states={
					hasCounter:false,
					hasTitle:false,
					hasSubTitle:false,
					hasImage:false,
					hasLink:false
				}
				const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
				Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);

				let rtn=[];
				items.map((item,index)=>{
					rtn.push(
						<li className={item.classes}>
							{states.hasCounter &&
								<div className='counter'>
									{countPrefix && <span class="prefix">{countPrefix}</span>}
									<span className="number">{index+1}</span>
									{countSuffix && <span class="suffix">{countSuffix}</span>}
								</div>
							}
							{states.hasTitle && <h3>{item.title}</h3>}
							<div class="contents">
								{states.hasImage && <div className='image'><img src={item.src} alt={item.alt}/></div>}
								<div class="text">
									{states.hasSubTitle && <h4>{item.subTitle}</h4>}
									<p>{item.text}</p>
									{states.hasLink && <div className='link'><a href={item.linkUrl}>{item.linkText}</a></div>}
								</div>
							</div>
						</li>
					);
				});
				for(let i=0;i<spacer;i++){rtn.push(<li className="spacer"></li>);}
				return <ul className={classes}>{rtn}</ul>;
			},
			migrate(attributes){
				attributes.classes+=' hasText';
				return attributes;
			}
		}
	]
});