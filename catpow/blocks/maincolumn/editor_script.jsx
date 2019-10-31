registerBlockType('catpow/maincolumn',{
	title:'🐾 MainColumn',
	icon:'editor-code',
	category:'catpow',
	attributes:{
		columnType:{type:'string',default:'main'}
	},
    parent:['catpow/sidebar'],
	edit({attributes,className,setAttributes}){
        return [
			<div className={'column column_main'}>
				<InnerBlocks template={[['catpow/section']]} templateLock={false}/>
			</div>
        ];
    },
	save({attributes,className,setAttributes}){
		return (
			<div className={'column column_main'}>
				<InnerBlocks.Content/>
			</div>
		);
	}
});