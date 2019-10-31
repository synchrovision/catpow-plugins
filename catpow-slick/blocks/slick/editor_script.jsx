registerBlockType('catpow/slick',{
	title:'🐾 Slick',
	icon:'video-alt3',
	category:'layout',

	attributes:{
		classes:{source:'attribute',selector:'ul',attribute:'class',default:'wp-block-catpow-slick hasTitle hasText hasImage articles'},
		slick:{
			source:'attribute',
			selector:'ul',
			attribute:'data-slick',
			default:'{"slidesToShow":"3"}'
		},
		items:{
			source:'query',
			selector:'li.item',
			query:{
				title:{source:'children',selector:'.text h3'},
				subTitle:{source:'children',selector:'.text h4'},
				src:{source:'attribute',selector:'.image img',attribute:'src'},
				alt:{source:'attribute',selector:'.image img',attribute:'alt'},
				text:{source:'children',selector:'.text p'},
				url:{source:'attribute',selector:'a',attribute:'href'},
				bg:{source:'attribute',attribute:'style'}
			},
			default:[]
		}
	},
	edit({attributes,className,setAttributes}){
		const {classes,slick,items}=attributes;
		const primaryClass='wp-block-catpow-slick';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
		const slickDefault={
			accessibility:true,
			adaptiveHeight:false,
			autoplay:false,
			autoplaySpeed:3000,
			arrows:true,
			asNavFor:null,
			centerMode:false,
			centerPadding:'50px',
			cssEase:'ease',
			dots:false,
			draggable:true,
			fade:false,
			focusOnSelect:false,
			infinite:true,
			initialSlide:0,
			pauseOnFocus:true,
			pauseOnHover:true,
			pauseOnDotsHover:false,
			respondTo:'window',
			responsive:null,
			rows:1,
			slidesPerRow:1,
			slidesToShow:1,
			slidesToScroll:1,
			speed:300,
			swipe:true,
			swipeToSlide:false,
			touchMove:true,
			touchThreshold:5,
			variableWidth:false,
			vertical:false,
			verticalSwiping:false,
			rtl:false,
			waitForAnimate:true,
		};
		
		let slickData=jQuery.extend(true,{},slickDefault,JSON.parse(slick));
		let itemsCopy=items.map((obj)=>jQuery.extend(true,{},obj));
		
		const media_uploader = wp.media({
			title:'Select Image',
			button:{text:'Select'},  
			multiple:false
		});
		const selectImage=(index,srcAttr,altAttr,asBG=false)=>{
			media_uploader.off('select');
			media_uploader.on('select',()=>{
				let image = media_uploader.state().get('selection').first().toJSON();
				if(asBG){itemsCopy[index][srcAttr]={backgroundImage:`url('${image.url}')`};}
				else{itemsCopy[index][srcAttr]=image.url;}
				if(altAttr){itemsCopy[index][altAttr]=image.alt;}
				setAttributes({items:itemsCopy});
			});
			media_uploader.open();
		};
		
		
		const deleteItem=(index)=>{
			itemsCopy.splice(index,1);
			setAttributes({items:itemsCopy});
		};
		const cloneItem=(index)=>{
			itemsCopy.splice(index,0,jQuery.extend(true,{},itemsCopy[index]));
			setAttributes({items:itemsCopy});
		};
		const upItem=(index)=>{
			if(!itemsCopy[index-1])return false;
			itemsCopy.splice(index-1,2,itemsCopy[index],itemsCopy[index-1]);
			setAttributes({items:itemsCopy});
		};
		const downItem=(index)=>{
			if(!itemsCopy[index+1])return false;
			itemsCopy.splice(index,2,itemsCopy[index+1],itemsCopy[index]);
			setAttributes({items:itemsCopy});
		};
		const slickGoto=(index)=>{
			setSlick({initialSlide:(index+items.length)%items.length})
		};
		const slickPrev=()=>{
			slickGoto(slickData.initialSlide-1);
		};
		const slickNext=()=>{
			slickGoto(slickData.initialSlide+1);
		};
		
		var states={
			hasTitle:false,
			hasSubTitle:false,
			hasText:false,
			hasImage:false,
			hasBackgroundImage:false
		};
		
		var selectiveClasses=[
			'mainvisual',
			'articles',
			'thumbnails'
		];
		
		const switchSelectiveClass=(cls)=>{
			var classNameArray=className.split(' ');
			classNameArray=_.difference(classNameArray,[primaryClass],selectiveClasses);
			classNameArray.push(cls);
			setAttributes({className:classNameArray.join(' ')})
		};
		const getSelectiveClass=()=>{
			return _.intersection(classArray,selectiveClasses).shift();
		};
		
		
		const toggleClass=(cls)=>{
			let i=classArray.indexOf(cls);
			if(i===-1){classArray.push(cls);}
			else{classArray.splice(i,1);}
			setAttributes({classes:classArray.join(' ')});
		};
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		if(className===primaryClass){
			var additionalClassArray=classArray.filter(function(cls){
				if(cls === primaryClass)return false;
				if(cls in states)return false;
				return true;
			});
			if(additionalClassArray.length){
				setAttributes({className:additionalClassArray.join(' ')});
			}
		}
		else{
			var classNameArray=className.split(' ');
			var hasRemovedClass=false;
			classArray=_.union(classArray,classNameArray);
			var classArray=classArray.filter(function(cls){
				if(classNameArray.indexOf(cls)!==-1)return true;
				if(cls in states)return true;
				hasRemovedClass=true;
				return false;
			});
			if(hasRemovedClass){
				setAttributes({classes:classArray.join(' ')});
			}
		}
		
		const setSlick=(conf)=>{
			let slickDataCopy=_.extend(slickData,conf);
			Object.keys(slickDataCopy).forEach(key=>{
				if(slickDefault[key]==slickDataCopy[key]){delete(slickDataCopy[key]);}
			});
			setAttributes({slick:JSON.stringify(slickDataCopy)});
		};
		
		var rtn=[];
		
		const pushItem=(item,index)=>{
			if(states.hasBackgroundImage){
				if(typeof item.bg === 'string'){
					item.bg={backgroundImage:item.bg.substr('background-image:'.length)};
				}
			}
			else{item.bg={}}
			rtn.push(
				<li onKeyDown={(e)=>{
					if((e.ctrlKey || e.metaKey)){
						let doSomething=true;
						switch(e.key){
							case 'd':cloneItem(index);break;
							case 'Backspace':deleteItem(index);break;
							case 'ArrowUp':upItem(index);break;
							case 'ArrowDown':downItem(index);break;
							case 'ArrowLeft':slickPrev();break;
							case 'ArrowRight':slickNext();break;
							default:doSomething=false;
						}
						if(doSomething){e.preventDefault();}
					}}}
					class={'item'} style={item.bg}>
					{states.hasImage &&
						<div className='image'>
							<img onClick={(e)=>{selectImage(index,'src','alt');}} src={item.src} alt={item.alt}/>
						</div>
					}
					<div class="text">
						{states.hasTitle && 
							<RichText
								tagName='h3'
								onChange={(text)=>{itemsCopy[index].title=text;setAttributes({items:itemsCopy});}}
								value={item.title}
							/>
						}
						{states.hasSubTitle &&
							<RichText
								tagName='h4'
								onChange={(subTitle)=>{itemsCopy[index].subTitle=subTitle;setAttributes({items:itemsCopy});}}
								value={item.subTitle}
							/>
						}
						{states.hasText &&
							<RichText
								tagName='p'
								onChange={(text)=>{itemsCopy[index].text=text;setAttributes({items:itemsCopy});}}
								value={item.text}
							/>
						}
					</div>
					<div class="control">
						<div className='btn delete' onClick={(e)=>deleteItem(index)}></div>
						<div className='btn clone' onClick={(e)=>cloneItem(index)}></div>
					</div>
				</li>
			);
		}
		
		const l=items.length;
		for(
			let i=slickData.initialSlide-Math.floor(slickData.slidesToShow/2)+l,
			to=slickData.initialSlide+Math.ceil(slickData.slidesToShow/2)+l;
			i<to;i++
		){pushItem(items[i%l],i%l);}
		
		const setSlidesToShow=(bp,n)=>{
			let m=slickData.slidesToShow;
			var rsp=[];
			if(slickData.responsive){
				var prev=m;
				if(!slickData.responsive.some((val)=>{
					if(val.breakpoint == bp){val.settings.slidesToShow=n;return true;}
					return false;
				})){
					slickData.responsive.push({
						breakpoint: bp,
						settings:{
							slidesToShow:n
						}
					});
					slickData.responsive.sort((a,b)=>{parseInt(b.breakpoint) - parseInt(a.breakpoint);});
				}
				rsp=slickData.responsive.filter((val)=>{
					if(prev==val.settings.slidesToShow){return false;}
					prev=val.settings.slidesToShow;
					return true;
				});
				if(rsp.lengh==0){rsp=null;}
			}
			else{
				if(m==n){return false;}
				rsp=[
					{
						breakpoint: bp,
						settings:{
							slidesToShow:n
						}
					}
				];
			}
			
			setSlick({responsive:rsp});
		}
		const getSlidesToShow=(bp)=>{
			if(slickData.responsive){
				for(let i=slickData.responsive.length-1;i>=0;i--){
					if(slickData.responsive[i].breakpoint >= bp){
						return slickData.responsive[i].settings.slidesToShow;
					}
				}
			}
			return slickData.slidesToShow;
		}
		
        return [
			<ul className={classArray.join(' ')} data-slick={slick}>{rtn}</ul>,
			
			<InspectorControls>
				<PanelBody title="表示設定" initialOpen={false} icon="admin-appearance">
					<CheckboxControl
						label='タイトル'
						onChange={(hasTitle)=>{toggleClass('hasTitle');}}
						checked={states.hasTitle}
					/>
					<CheckboxControl
						label='サブタイトル'
						onChange={(hasSubTitle)=>{toggleClass('hasSubTitle');}}
						checked={states.hasSubTitle}
					/>
					<CheckboxControl
						label='テキスト'
						onChange={(hasText)=>{toggleClass('hasText');}}
						checked={states.hasText}
					/>
					<CheckboxControl
						label='画像'
						onChange={(hasImage)=>{toggleClass('hasImage');}}
						checked={states.hasImage}
					/>
					<CheckboxControl
						label='背景画像'
						onChange={(hasBackgroundImage)=>{toggleClass('hasBackgroundImage');}}
						checked={states.hasBackgroundImage}
					/>
					{states.hasBackgroundImage &&
						<div className={'imageSelector'} onClick={()=>selectImage(slickData.initialSlide,'bg',false,true)} style={items[slickData.initialSlide].bg}>　</div>
					}
					<RangeControl
						label='表示スライド'
						onChange={(n)=>{setSlick({initialSlide:n});}}
						value={slickData.initialSlide}
						min={0}
						max={items.length-1}
					/>
					<RangeControl
						label='表示数'
						onChange={(n)=>{setSlick({slidesToShow:n});}}
						value={slickData.slidesToShow}
						min={1}
						max={items.length}
					/>
					<RangeControl
						label='タブレット表示数'
						onChange={(n)=>{setSlidesToShow(800,n);}}
						value={getSlidesToShow(800)}
						min={1}
						max={items.length}
					/>
					<RangeControl
						label='スマホ表示数'
						onChange={(n)=>{setSlidesToShow(480,n);}}
						value={getSlidesToShow(480)}
						min={1}
						max={items.length}
					/>
					<CheckboxControl
						label='アロー'
						onChange={(arrows)=>{setSlick({arrows:arrows});}}
						checked={slickData.arrows}
					/>
					<CheckboxControl
						label='ドット'
						onChange={(dots)=>{setSlick({dots:dots});}}
						checked={slickData.dots}
					/>
				</PanelBody>
				<PanelBody title="アニメーション設定" initialOpen={false} icon="video-alt3">
					<CheckboxControl
						label='自動再生'
						onChange={(autoplay)=>{setSlick({autoplay:autoplay});}}
						checked={slickData.autoplay}
					/>
					{slickData.autoplay && 
						<RangeControl
							label='自動再生間隔（単位秒）'
							onChange={(n)=>{setSlick({autoplaySpeed:n*1000});}}
							value={slickData.autoplaySpeed/1000}
							min={0}
							max={10}
						/>
					}
					<RangeControl
						label='アニメーション時間（単位:0.1秒）'
						onChange={(n)=>{setSlick({speed:n*100});}}
						value={slickData.speed/100}
						min={0}
						max={100}
					/>
					<SelectControl
						label='イージング'
						onChange={(cssEase)=>{setSlick({cssEase:cssEase});}}
						selected={slickData.cssEase}
						options={[
							{label:'あり',value:'ease'},
							{label:'なし',value:'linear'}
						]}
					/>
					<CheckboxControl
						label='ループ'
						onChange={(infinite)=>{setSlick({infinite:infinite});}}
						checked={slickData.infinite}
					/>
					<CheckboxControl
						label='フェード'
						onChange={(fade)=>{setSlick({fade:fade});}}
						checked={slickData.fade}
					/>
				</PanelBody>
				<PanelBody title="拡張設定" initialOpen={false} icon="universal-access">
					<CheckboxControl
						label='キーボードで操作'
						onChange={(accessibility)=>{setSlick({accessibility:accessibility});}}
						checked={slickData.accessibility}
					/>
					<TextControl
						label='連動'
						onChange={(asNavFor)=>{setSlick({asNavFor:asNavFor});}}
						value={slickData.asNavFor}
					/>
				</PanelBody>
				<PanelBody title="クラス" initialOpen={false} icon="art">
					<SelectControl
						label='クラス'
						onChange={switchSelectiveClass}
						value={getSelectiveClass()}
						options={selectiveClasses.map(cls=>{return {label:cls,value:cls};})}
					/>
				</PanelBody>
				<PanelBody title="操作" initialOpen={false} icon="info">
					<table>
						<tbody>
							<tr>
								<th>⌘/Ctrl + D</th>
								<td>複製</td>
							</tr>
							<tr>
								<th>⌘/Ctrl + delete</th>
								<td>削除</td>
							</tr>
							<tr>
								<th>⌘/Ctrl + ←</th>
								<td>前のスライドを表示</td>
							</tr>
							<tr>
								<th>⌘/Ctrl + →</th>
								<td>次のスライドを表示</td>
							</tr>
							<tr>
								<th>⌘/Ctrl + ↑</th>
								<td>前のスライドと入れ替え</td>
							</tr>
							<tr>
								<th>⌘/Ctrl + ↓</th>
								<td>次のスライドと入れ替え</td>
							</tr>
						</tbody>
					</table>
				</PanelBody>
			</InspectorControls>
		];
    },
	save({attributes,className,setAttributes}){
		const {classes,slick,items}=attributes;
		
		var classArray=classes.split(' ');
		
		var states={
			hasTitle:false,
			hasSubTitle:false,
			hasText:false,
			hasImage:false,
			hasBackgroundImage:false
		};
		const hasClass=(cls)=>(classArray.indexOf(cls)!==-1);
		
		Object.keys(states).forEach(function(key){this[key]=hasClass(key);},states);
		
		var rtn=[];
		items.map(function(item,index){
			if(states.hasBackgroundImage){
				if(typeof item.bg === 'string'){
					item.bg={backgroundImage:item.bg.substr('background-image:'.length)};
				}
			}
			else{item.bg={}}
			rtn.push(
				<li class={'item'} style={item.bg}>
					{states.hasImage &&
						<div className='image'>
							<img src={item.src} alt={item.alt}/>
						</div>
					}
					<div class="text">
						{states.hasTitle && <h3>{item.title}</h3>}
						{states.hasSubTitle && <h4>{item.subTitle}</h4>}
						{states.hasText && <p>{item.text}</p>}
					</div>
				</li>
			);
		});
		
		
		
		return <ul className={classes} data-slick={slick}>{rtn}</ul>;
	}
});