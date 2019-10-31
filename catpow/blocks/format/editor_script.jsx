registerBlockType('catpow/format',{
	title:'🐾 Format',
	icon:'editor-code',
	category:'catpow',
	attributes:{
		classes:{source:'attribute',selector:'div',attribute:'class',default:'wp-block-catpow-format'},
		content_path:{source:'string'},
		content:{source:'children',selector:'div'},
	},
	edit({attributes,className,setAttributes}){
        const {classes,content_path,content}=attributes;
		const primaryClass='wp-block-catpow-format';
		
		return [
			<RichText 
				onChange={(content)=>{setAttributes({content});}}
				value={content}
			/>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.format}
						onChange={(content_path)=>{
							setAttributes({
								content_path:content_path,
								content:content_path
							});
						}}
					/>
				</PanelBody>
			</InspectorControls>
		];
    },


	save({attributes,className,setAttributes}){
        const {classes,content}=attributes;
		console.log(content);
		return (
			<div className={classes}>{content}</div>
		);
	}
});

