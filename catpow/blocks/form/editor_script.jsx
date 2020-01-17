registerBlockType('catpow/form',{
	title: '🐾 Form',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className}){
        const {content_path,post_data_path,inputs}=attributes;
		
		let postDataSelection=false;
		
		Object.keys(cpEmbeddablesTree.form).forEach((parentKey)=>{
			cpEmbeddablesTree.form[parentKey].children.map((item)=>{
				if(item.id===content_path && item.post_data_paths){
					postDataSelection=[];
					Object.keys(item.post_data_paths).forEach(function(key){
						postDataSelection.push({id:key,name:item.post_data_paths[key]});
					});
				}
			});
		});
		if(postDataSelection===false){
			if(post_data_path){setAttributes({post_data_path:false});}
		}
		else{
			if(!post_data_path || !postDataSelection.some((item)=>item['id']===post_data_path)){
				setAttributes({post_data_path:postDataSelection[0]['id']});
			}
		}
		
        return [
			<div class="embedded_content">
				<div class="label">{content_path}</div>
				<ServerSideRender block='catpow/form' attributes={attributes}/>
			</div>,
			<InspectorControls>
				<PanelBody title="Path">
					<TreeSelect
						label='path'
						selectedId={content_path}
						tree={cpEmbeddablesTree.form}
						onChange={(content_path)=>{
							setAttributes({content_path:content_path});
						}}
					/>
					{postDataSelection &&
						<TreeSelect
							label='form'
							selectedId={post_data_path}
							tree={postDataSelection}
							onChange={(post_data_path)=>{
								setAttributes({post_data_path:post_data_path});
							}}
						/>
					}
				</PanelBody>
                <PanelBody title="初期入力値">
                    <TextareaControl
                        label='inputs'
                        value={inputs}
                        onChange={(inputs)=>{setAttributes({inputs:inputs});}}
                    />
                </PanelBody>
			</InspectorControls>
        ];
    },

	save({attributes,className,setAttributes}){
		return 'null';
	}
});