registerBlockType('catpow/t-cover',{
	title:'🐾 T-Cover',
	icon:'editor-code',
	category:'catpow-mail',
	attributes:{
		classes:{source:'attribute',selector:'table',attribute:'class',default:'wp-block-catpow-t-cover'},
		src:{source:'attribute',selector:'[src]',attribute:'src',default:cp.theme_url+'/images/dummy.jpg'},
		alt:{source:'attribute',selector:'[src]',attribute:'alt'},
	},
	edit({attributes,className,setAttributes}){
        const {classes,src,alt}=attributes;
		const primaryClass='wp-block-catpow-t-cover';
		var states=CP.wordsToFlags(classes);
		
		var selectiveClasses=[
		];
		
        return [
			<table width="100%" className={classes}>
				<tbody>
					<tr>
						<td>
							<SelectResponsiveImage
								set={setAttributes}
								attr={attributes}
								keys={{src:'src',alt:'alt'}}
								size="large"
								width="100%"
								height="auto"
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
					filters={CP.filters['t-cover'] || {}}
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
        const {classes,src,alt}=attributes;
		const primaryClass='wp-block-catpow-t-cover';
		return (
			<table width="100%" className={classes}>
				<tbody>
					<tr>
						<td><img width="100%" height="auto" src={src} alt={alt}/></td>
					</tr>
				</tbody>
			</table>
		);
	}
});

