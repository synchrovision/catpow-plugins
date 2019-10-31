registerBlockType('catpow/snippet',{
	title: '🐾 Snippet',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        const {content_path,query}=attributes;
		 
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<ServerSideRender block='catpow/snippet' attributes={attributes}/>
			</div>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.snippet}
						onChange={(content_path)=>{setAttributes({content_path:content_path});}}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },

	save({attributes,className,setAttributes}){
		return 'null';
	}
});