registerBlockType('catpow/loopblock',{
	title: '🐾 Loopblock',
	icon: 'editor-code',
	category: 'catpow-functional',
	example:CP.example,
	edit({attributes,setAttributes,className}){
        const {content_path,query}=attributes;
		 
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<InnerBlocks/>
			</div>,
			<InspectorControls>
				<PanelBody title="Query">
					<TextControl
						label='content path'
						value={content_path}
						onChange={(query)=>{setAttributes({content_path});}}
					/>
					<TextareaControl
						label='query'
						value={query}
						onChange={(query)=>{setAttributes({query});}}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },

	save({attributes,className,setAttributes}){
		return <InnerBlocks.Content/>;
	}
});