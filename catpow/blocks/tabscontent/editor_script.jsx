registerBlockType('catpow/tabscontent',{
	title:'🐾 TabsContent',
	icon:'editor-code',
	category:'catpow',
    parent:['catpow/tabs'],
	edit({attributes,className,setAttributes}){
        return [
			<div className={'tabs_content'}>
				<InnerBlocks template={[['catpow/section']]} templateLock={false}/>
			</div>
        ];
    },
	save({attributes,className,setAttributes}){
		return (
			<div className={'tabs_content'}>
				<InnerBlocks.Content/>
			</div>
		);
	}
});