﻿registerBlockType('catpow/t-box',{
	title:'🐾 T-Box',
	icon:'editor-code',
	category:'catpow-mail',
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-t-box large'}
	},
	example:CP.example,
	edit({attributes,className,setAttributes}){
        const {classes}=attributes;
		const primaryClass='wp-block-catpow-t-box';
		var states=CP.wordsToFlags(classes);
		
		var selectiveClasses=[
			{label:'サイズ',values:['large','medium','small']}
		];
		
        return [
			<table className={classes}>
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
					filters={CP.filters['t-box'] || {}}
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
        const {classes}=attributes;
		const primaryClass='wp-block-catpow-t-box';
		var states=CP.wordsToFlags(classes);
		return (
			<table className={classes}>
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

