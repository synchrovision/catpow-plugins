registerBlockType('catpow/userinfo',{
	title: '🐾 UserInfo',
	icon: 'admin-users',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        return [
			<div class="embedded_content">
				<div class="label">UserInfo</div>
				<InnerBlocks template={[
					['core/paragraph',{content:'[output last_name] [output first_name]'}]
				]}/>
			</div>
        ];
    },

	save({attributes,className,setAttributes}){
		return <InnerBlocks.Content/>;
	}
});