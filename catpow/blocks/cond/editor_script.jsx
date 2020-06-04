﻿registerBlockType('catpow/cond',{
	title:'🐾 Cond',
	icon:'editor-code',
	category:'catpow',
	transforms:{
		from: [
			{
				type:'block',
				blocks:['core/group'],
				transform:(attributes,innerBlocks)=>{
					return createBlock('catpow/cond',{},innerBlocks);
				},
			},
		]
	},
	edit({attributes,className,setAttributes}){
        return [
			<div className="embedded_content">
				<div class="label">表示条件</div>
				<InnerBlocks/>
			</div>,
			<InspectorControls>
				<PanelBody title="表示条件" icon="admin-generic">
					<TextareaControl
						label='スケジュール'
						onChange={(schedule)=>setAttributes({schedule})}
						value={attributes.schedule}
					/>
					<SelectControl
						label='ログイン'
						onChange={(is_user_logged_in)=>{setAttributes({is_user_logged_in})}}
						value={attributes.is_user_logged_in}
						options={[
							{label:'していない',value:'-1'},
							{label:'どちらでも',value:'0'},
							{label:'している',value:'1'},
						]}
					/>
					{attributes.is_user_logged_in !== '-1' &&
						<TextareaControl
							label='権限'
							onChange={(current_user_can)=>setAttributes({current_user_can})}
							value={attributes.current_user_can}
						/>
					}
					<TextareaControl
						label='フォーム入力値'
						onChange={(input_value)=>setAttributes({input_value})}
						value={attributes.input_value}
					/>
				</PanelBody>
			</InspectorControls>
        ];
    },


	save({attributes,className,setAttributes}){
		return (<InnerBlocks.Content/>);
	}
});

