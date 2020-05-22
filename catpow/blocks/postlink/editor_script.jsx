registerBlockType('catpow/postlink',{
	title: '🐾 PostLink',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        const {func,param}=attributes;
        
        return [
			<ServerSideRender block='catpow/postlink' attributes={Object.assign({},attributes,{preview:true})}/>,
			<InspectorControls>
				<PanelBody title="Path">
				</PanelBody>
			</InspectorControls>
        ];
    },

	save({attributes,className,setAttributes}){
		return 'null';
	}
});