registerBlockType('catpow/sidecolumn',{
	title:'🐾 SideColumn',
	icon:'editor-code',
	category:'catpow',
    parent:['catpow/sidebar'],
	edit({attributes,className,setAttributes}){
        return [
			<div className={'column column_side'}>
				<div class="column_side_container">
					<InnerBlocks template={[['catpow/articlenav']]} templateLock={false}/>
				</div>
                <div class="sidebar_button"></div>
			</div>
        ];
    },
	save({attributes,className,setAttributes}){
		return (
			<div className={'column column_side'}>
				<div class="column_side_container"><InnerBlocks.Content/></div>
                <div class="sidebar_button"></div>
			</div>
		);
	},
	deprecated:[
		{
			save({attributes,className,setAttributes}){
				return (
					<div className={'column column_side'}>
						<InnerBlocks.Content/>
						<div class="sidebar_button"></div>
					</div>
				);
			}
		}
	]
});