registerBlockType('catpow/loop',{
	title: '🐾 Loop',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        const {content_path,query}=attributes;
		 
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<ServerSideRender block='catpow/loop' attributes={attributes}/>
			</div>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.loop}
						onChange={(content_path)=>{setAttributes({content_path:content_path});}}
					/>
				</PanelBody>
				{content_path && content_path.substr(-8)==='loop.php' &&
					<PanelBody title="Query">
						<TextareaControl
							label='query'
							value={query}
							onChange={(query)=>{setAttributes({query:query});}}
						/>
					</PanelBody>
				}
			</InspectorControls>
        ];
    },

	save({attributes,className,setAttributes}){
		return 'null';
	}
});