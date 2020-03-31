<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class manage extends template_type{
	public static function get_menus($conf_data){
		return [
			'top'=>[
				$conf_data['label']=>$conf_data['alias_path']
			]
		];
	}
	public static function get_template_files($conf_data){
		return array_merge([
			'admin.php'=>[
				'php',
				'namespace Catpow;',
				'clear(3);',
				"§sec('search');"
			],
			'sec_search.php'=>[
				'',
				['php',
				 	"namespace Catpow;",
					"\cp::enqueue_style('blocks/section/front_style.css');",
					"wp_enqueue_script('cp_search');"
				],
				['div#cp_search',
				 	['div#cpcf_custom_box',
						['div#cpcf_custom_box_button'],
						['div.inside',
							'@inputs_search',
							[
								'ul.buttons',
								['li.primary',['php',"button(_('検索'),'results','replace');"]]
							]
						]
					]
				],
				['php','§results();'],
				['php','§message();']
			],
			'sec_search-results.php'=>[
				'',[
					'php',
					'namespace Catpow;',
					'receive();'
				],
				'@loop_manage_table',
			],
		],static::get_manage_table_template_files($conf_data));
	}
	public static function get_manage_table_template_files($conf_data){
		return [
			'sec_manage_item.php'=>[
				'',
				'@catpow',
				'@loop_manage_table_item'
			],
			'sec_manage_item-add.php'=>[
				'',
				'@catpow',
				'@loop_add_table_item'
			],
			'sec_manage_item-create.php'=>[
				'php',
				'namespace Catpow;',
				"§sec('manage_item@tr',push());"
			],
			'sec_manage_item-edit.php'=>[
				'',
				'@catpow',
				"@inputs 1",
				"@button center close.danger:削除:delete:remove refresh:更新:save:replace"
			],
			'sec_manage_item-save.php'=>[
				'php',
				'namespace Catpow;',
				'if(receive()){push();};',
				"inc('sec_manage_item');"
			],
			'sec_manage_item-delete.php'=>[
				'php',
				'namespace Catpow;',
				'delete();',
			],
		];
	}
	
}

?>