registerBlockType('catpow/tool',{
	title: '🐾 Tool',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        const {content_path,query}=attributes;
		
		if(attributes.postID===undefined){setAttributes({postID:wp.data.select("core/editor").getCurrentPostId()});}
		
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<ServerSideRender block='catpow/tool' attributes={attributes}/>
			</div>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.tool}
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