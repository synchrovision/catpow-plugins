registerFormatType('catpow/ruby',{
	title:'Ruby',
	tagName:'ruby',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>{
			if(isActive){
				return onChange(wp.richText.toggleFormat(value,{type:'catpow/ruby'}));
			}
			if(wp.richText.isCollapsed(value)){alert(__('ルビをつけたいテキストを選択してください'));return;}
			let rt=prompt(__('ルビを入力'));
			if(rt===null){return;}
			return onChange(wp.richText.insert(
				value,wp.richText.create({html:'<ruby>'+wp.richText.slice(value).text+'<rt>'+rt+'</rt></ruby>'}),value.start,value.end
			));
		}
		
		const icon=(
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
				<path d="M3.6,19.8L8.9,6.2h1.9l5.6,13.6h-2l-1.6-4.1H7l-1.5,4.1H3.6z M7.6,14.2h4.6l-1.4-3.8c-0.4-1.1-0.8-2.1-1-2.8
				c-0.2,0.9-0.4,1.7-0.7,2.6L7.6,14.2z"/>
				<path d="M10.7,4.4C10.4,4.7,10.1,4.9,9.8,5C9.6,5.1,9.3,5.1,9,5.1C8.4,5.2,8,5,7.7,4.8c-0.3-0.3-0.4-0.6-0.4-1c0-0.2,0-0.4,0.2-0.6
					C7.6,3,7.7,2.8,7.9,2.7C8,2.6,8.2,2.5,8.5,2.4c0.2,0,0.4-0.1,0.7-0.1c0.7-0.1,1.1-0.2,1.4-0.3c0-0.1,0-0.2,0-0.2
					c0-0.3-0.1-0.6-0.2-0.7c-0.2-0.2-0.5-0.3-0.9-0.3C9.1,0.8,8.8,0.9,8.6,1C8.4,1.2,8.3,1.4,8.2,1.8L7.4,1.7C7.5,1.3,7.6,1,7.8,0.8
					c0.2-0.2,0.4-0.4,0.7-0.5c0.3-0.1,0.7-0.2,1.1-0.2c0.4,0,0.7,0,1,0.1c0.3,0.1,0.4,0.2,0.6,0.4c0.1,0.1,0.2,0.3,0.3,0.5
					c0,0.1,0,0.4,0,0.7l0,1.1c0,0.8,0,1.2,0.1,1.4c0,0.2,0.1,0.4,0.2,0.6l-0.8,0C10.8,4.9,10.7,4.7,10.7,4.4z M10.6,2.6
					C10.3,2.8,9.9,2.9,9.3,3C9,3,8.7,3.1,8.6,3.1C8.5,3.2,8.4,3.3,8.3,3.4C8.2,3.5,8.2,3.6,8.2,3.8c0,0.2,0.1,0.4,0.3,0.5
					c0.2,0.1,0.4,0.2,0.7,0.2c0.3,0,0.6-0.1,0.8-0.2s0.4-0.3,0.5-0.6c0.1-0.2,0.1-0.5,0.1-0.8L10.6,2.6z"/>
			</svg>
		);

		return [
			<Fragment>
				<RichTextShortcut
					type={'primary'}
					character={'r'}
					onUse={onToggle}
				/>
				<RichTextToolbarButton
					icon={icon}
					title={'Ruby'}
					onClick={onToggle}
					isActive={isActive}
					shortcutType={'primary'}
					shortcutCharacter={'r'}
				/>
			</Fragment>
		];
	}
});
registerFormatType('catpow/rt',{
	title:'RubyText',
	tagName:'rt',
	className:null
});
registerFormatType('catpow/small',{
	title:'small',
	tagName:'small',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/small'}));
		
		const icon=(
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
				<path d="M5.6,16.7l3.6-9.4h1.3l3.8,9.4H13l-1.1-2.8H8l-1,2.8H5.6z M8.3,12.9h3.2l-1-2.6C10.2,9.5,10,8.9,9.9,8.4
		C9.7,9,9.6,9.6,9.3,10.1L8.3,12.9z"/>
			</svg>
		);

		return [
			<Fragment>
				<RichTextShortcut
					type={'primary'}
					character={'-'}
					onUse={onToggle}
				/>
				<RichTextToolbarButton
					icon={icon}
					title={'small'}
					onClick={onToggle}
					isActive={isActive}
					shortcutType={'primary'}
					shortcutCharacter={'-'}
				/>
			</Fragment>
		];
	}
});

registerFormatType('catpow/sub',{
	title:'sub',
	tagName:'sub',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/sub'}));
		
		const icon=(
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
				<path d="M0,17.6L5.7,2.9h2.1l6,14.7h-2.2l-1.7-4.5H3.7l-1.6,4.5H0z M4.3,11.6h5L7.7,7.5c-0.5-1.2-0.8-2.3-1-3.1
				C6.5,5.4,6.2,6.3,5.9,7.2L4.3,11.6z"/>
				<path d="M18.3,16.8c-0.3,0.3-0.7,0.5-1,0.6c-0.3,0.1-0.7,0.2-1,0.2c-0.6,0-1.1-0.1-1.4-0.4c-0.3-0.3-0.5-0.7-0.5-1.1c0-0.3,0.1-0.5,0.2-0.8c0.1-0.2,0.3-0.4,0.5-0.6c0.2-0.1,0.4-0.2,0.7-0.3c0.2-0.1,0.5-0.1,0.8-0.2c0.8-0.1,1.3-0.2,1.7-0.3
				c0-0.1,0-0.2,0-0.2c0-0.4-0.1-0.7-0.3-0.8c-0.2-0.2-0.6-0.3-1.1-0.3c-0.4,0-0.8,0.1-1,0.2s-0.4,0.4-0.5,0.8l-0.9-0.1
				c0.1-0.4,0.2-0.7,0.4-1c0.2-0.2,0.5-0.4,0.8-0.6c0.4-0.1,0.8-0.2,1.3-0.2c0.5,0,0.9,0,1.2,0.2c0.3,0.1,0.5,0.2,0.7,0.4
				c0.1,0.2,0.2,0.4,0.3,0.6c0,0.2,0.1,0.5,0.1,0.9l0,1.3c0,0.9,0,1.4,0.1,1.7c0,0.2,0.1,0.5,0.2,0.7l-1,0
				C18.4,17.3,18.3,17,18.3,16.8z M18.2,14.7c-0.3,0.1-0.9,0.3-1.5,0.4c-0.4,0.1-0.7,0.1-0.8,0.2c-0.2,0.1-0.3,0.2-0.4,0.3
				c-0.1,0.1-0.1,0.3-0.1,0.5c0,0.3,0.1,0.5,0.3,0.6c0.2,0.2,0.5,0.2,0.8,0.2c0.4,0,0.7-0.1,1-0.3s0.5-0.4,0.6-0.7
				c0.1-0.2,0.1-0.5,0.1-1L18.2,14.7z"/>
			</svg>
		);


		return [
			<Fragment>
				<RichTextToolbarButton
					icon={icon}
					title={'sub'}
					onClick={onToggle}
					isActive={isActive}
				/>
			</Fragment>
		];
	}
});
registerFormatType('catpow/sup',{
	title:'sup',
	tagName:'sup',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/sup'}));
		
		const icon=(
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
				<path d="M0,17.6L5.7,2.9h2.1l6,14.7h-2.2l-1.7-4.5H3.7l-1.6,4.5H0z M4.3,11.6h5L7.7,7.5c-0.5-1.2-0.8-2.3-1-3.1
					C6.5,5.4,6.2,6.3,5.9,7.2L4.3,11.6z"/>
				<path d="M18.3,7.8c-0.3,0.3-0.7,0.5-1,0.6c-0.3,0.1-0.7,0.2-1,0.2c-0.6,0-1.1-0.1-1.4-0.4c-0.3-0.3-0.5-0.7-0.5-1.1
					c0-0.3,0.1-0.5,0.2-0.8c0.1-0.2,0.3-0.4,0.5-0.6c0.2-0.1,0.4-0.2,0.7-0.3c0.2-0.1,0.5-0.1,0.8-0.2c0.8-0.1,1.3-0.2,1.7-0.3
					c0-0.1,0-0.2,0-0.2c0-0.4-0.1-0.7-0.3-0.8c-0.2-0.2-0.6-0.3-1.1-0.3c-0.4,0-0.8,0.1-1,0.2s-0.4,0.4-0.5,0.8l-0.9-0.1
					c0.1-0.4,0.2-0.7,0.4-1c0.2-0.2,0.5-0.4,0.8-0.6c0.4-0.1,0.8-0.2,1.3-0.2c0.5,0,0.9,0,1.2,0.2c0.3,0.1,0.5,0.2,0.7,0.4
					C18.9,3.5,19,3.7,19.1,4c0,0.2,0.1,0.5,0.1,0.9l0,1.3c0,0.9,0,1.4,0.1,1.7c0,0.2,0.1,0.5,0.2,0.7l-1,0C18.4,8.3,18.3,8,18.3,7.8z
					 M18.2,5.7c-0.3,0.1-0.9,0.3-1.5,0.4c-0.4,0.1-0.7,0.1-0.8,0.2c-0.2,0.1-0.3,0.2-0.4,0.3c-0.1,0.1-0.1,0.3-0.1,0.5
					c0,0.3,0.1,0.5,0.3,0.6c0.2,0.2,0.5,0.2,0.8,0.2c0.4,0,0.7-0.1,1-0.3s0.5-0.4,0.6-0.7c0.1-0.2,0.1-0.5,0.1-1L18.2,5.7z"/>
			</svg>
		);

		return [
			<Fragment>
				<RichTextToolbarButton
					icon={icon}
					title={'sup'}
					onClick={onToggle}
					isActive={isActive}
				/>
			</Fragment>
		];
	}
});

registerFormatType('catpow/underline',{
	title:'U',
	tagName:'u',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/underline'}))

		return [
			<Fragment>
				<RichTextShortcut
					type={'primary'}
					character={'u'}
					onUse={onToggle}
				/>
				<RichTextToolbarButton
					icon={'editor-underline'}
					title={'U'}
					onClick={onToggle}
					isActive={isActive}
					shortcutType={'primary'}
					shortcutCharacter={'u'}
				/>
			</Fragment>
		];
	}
});
registerFormatType('catpow/ib',{
	title:'InlineBlock',
	tagName:'span',
	className:'ib',
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/ib'}))

		return [
			<Fragment>
				<RichTextShortcut
					type={'secondary'}
					character={'i'}
					onUse={onToggle}
				/>
				<RichTextToolbarButton
					icon={'editor-code'}
					title={'InlineBlock'}
					onClick={onToggle}
					isActive={isActive}
					shortcutType={'secondary'}
					shortcutCharacter={'i'}
				/>
			</Fragment>
		];
	}
});
registerFormatType('catpow/mark',{
	title:'Mark',
	tagName:'mark',
	className:null,
	edit({isActive,value,onChange}){
		const onToggle=()=>onChange(toggleFormat(value,{type:'catpow/mark'}))

		return [
			<Fragment>
				<RichTextShortcut
					type={'primary'}
					character={'m'}
					onUse={onToggle}
				/>
				<RichTextToolbarButton
					icon={'tag'}
					title={'Mark'}
					onClick={onToggle}
					isActive={isActive}
					shortcutType={'primary'}
					shortcutCharacter={'m'}
				/>
			</Fragment>
		];
	}
});