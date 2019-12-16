registerBlockType('catpow/stickycontent',{
	title:'🐾 StickyContent',
	icon:'editor-code',
	category:'catpow',
    parent:['catpow/sticky'],
	edit({attributes,className,setAttributes}){
        return [
			<div className={'sticky_content'}>
				<InnerBlocks template={[['core/paragraph']]} templateLock={false}/>
			</div>
        ];
    },
	save({attributes,className,setAttributes}){
		return (
			<div className={'sticky_content'}>
				<InnerBlocks.Content/>
			</div>
		);
	}
});