registerBlockType('catpow/markdown',{
	title: '🐾 Markdown',
	icon: 'editor-code',
	category: 'catpow',
	edit({attributes,setAttributes,className,isSelected}){
        const {classes,code}=attributes;
		
		var selectiveClasses=[
			{label:'タイプ',values:['document','article','board']}
		];
		
		return <div className={classes}>
			{isSelected &&
				<div className="editor">
					<TextareaControl
						value={code}
						rows={15}
						onChange={(code)=>{setAttributes({code:code});}}
					/>
				</div>
			}
			<ServerSideRender block='catpow/markdown' attributes={attributes}/>
			
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
				/>
			</InspectorControls>
		</div>
    },

	save({attributes,className,setAttributes}){
        const {classes}=attributes;
		return <div className={classes}></div>
	}
});