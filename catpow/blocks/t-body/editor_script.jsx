registerBlockType('catpow/t-body',{
	title:'🐾 T-Body',
	icon:'editor-code',
	category:'catpow-mail',
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-t-body'}
	},
	edit({attributes,className,setAttributes}){
        const {classes,title}=attributes;
		const primaryClass='wp-block-catpow-t-body';
		var states=CP.wordsToFlags(classes);
		
		var selectiveClasses=[
			'color'
		];
		
        return [
			<table width="100%" className={classes}>
				<tbody>
					<tr>
						<td>
							<InnerBlocks/>
						</td>
					</tr>
				</tbody>
			</table>,
			<InspectorControls>
				<SelectClassPanel
					title='クラス'
					icon='art'
					set={setAttributes}
					attr={attributes}
					selectiveClasses={selectiveClasses}
					filters={CP.filters['t-body'] || {}}
				/>
				<PanelBody title="CLASS" icon="admin-generic" initialOpen={false}>
					<TextareaControl
						label='クラス'
						onChange={(classes)=>setAttributes({classes})}
						value={classes}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },


	save({attributes,className,setAttributes}){
        const {classes,title}=attributes;
		const primaryClass='wp-block-catpow-t-body';
		return (
			<table width="100%" className={classes}>
				<tbody>
					<tr>
						<td>
							<InnerBlocks.Content/>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

