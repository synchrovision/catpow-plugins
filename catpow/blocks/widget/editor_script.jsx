/*
* 規定のテンプレートを埋め込む
*/
registerBlockType('catpow/widget',{
	title: '🐾 Widget',
	icon: 'editor-code',
	category: 'catpow-embed',
	edit({attributes,setAttributes,className}){
        const {content_path,query}=attributes;
		 
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<ServerSideRender block='catpow/widget' attributes={attributes}/>
			</div>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.widget}
						onChange={(content_path)=>{setAttributes({content_path:content_path});}}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },
	example:CP.example,
	save({attributes,className,setAttributes}){
		return 'null';
	}
});