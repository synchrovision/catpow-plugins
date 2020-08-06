registerBlockType('catpow/t-header',{
	title:'🐾 T-Header',
	icon:'editor-code',
	category:'catpow-mail',
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-t-header'},
		height:{source:'attribute',selector:'table',attribute:'height',default:'100'},
		title:{source:'children',selector:'td',default:'Title'}
	},
	edit({attributes,className,setAttributes}){
        const {classes,height,title}=attributes;
		const primaryClass='wp-block-catpow-t-header';
		var states=CP.wordsToFlags(classes);
		
		var selectiveClasses=[
			'color',
			{input:'range',label:'高さ',key:'height',min:20,max:200,step:5}
		];
		
        return [
			<table width="100%" height={height} className={classes}>
				<tbody>
					<tr>
						<td>
							<RichText
								onChange={(title)=>{setAttributes({title});}}
								value={title}
							/>
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
					filters={CP.filters['t-header'] || {}}
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
        const {classes,height,title}=attributes;
		const primaryClass='wp-block-catpow-t-header';
		return (
			<table width="100%" height={height} className={classes}>
				<tbody>
					<tr>
						<td>{title}</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

