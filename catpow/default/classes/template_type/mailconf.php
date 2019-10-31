<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class mailconf extends template_type{
	public static function get_template_files($conf_data){
		return array_merge([
			'admin.php'=>[
				'',[
					'php',
					'namespace Catpow;',
				 	"\cp::enqueue_style('blocks/section/front_style.css');",
					'clear(3);',
				],
				['section.wp-block-catpow-section.article.header.level4',
				 	['div.contents',
					 	['header',
						 	['h2',"<?= _('送信・返信メール設定'); ?>"]
						],
					 	['div.text',
						 	'@loop_manage_table'
						]
					]
				]
				
			],
		],manage::get_manage_table_template_files($conf_data));
	}
}

?>