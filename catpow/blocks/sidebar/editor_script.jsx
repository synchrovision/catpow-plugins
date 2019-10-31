registerBlockType('catpow/sidebar',{
	title:'🐾 Sidebar',
	icon:'editor-code',
	category:'catpow',
	attributes:{
		classes:{source:'attribute',selector:'div',attribute:'class',default:'wp-block-catpow-sidebar left'},
	},
	edit({attributes,className,setAttributes}){
        const {classes}=attributes;
		const primaryClass='wp-block-catpow-sidebar';
		var classArray=_.uniq((className+' '+classes).split(' '));
		
        return [
			<div className={classes}>
				<InnerBlocks
                    template={[
                        ['catpow/maincolumn'],
                        ['catpow/sidecolumn']
                    ]}
                    templateLock='all'
                />
			</div>,
			<BlockControls>
				<AlignClassToolbar set={setAttributes} attr={attributes}/>
			</BlockControls>
        ];
    },


	save({attributes,className,setAttributes}){
        const {classes}=attributes;
		return (
			<div className={classes}>
				<InnerBlocks.Content/>
			</div>
		);
	}
});