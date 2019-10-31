<?php
namespace Catpow\template_type;
/**
* メールフォームのテンプレート
* ブロックとして記事本文中に埋め込んで使用します。
* 管理画面に送信するメールの設定と送信されたメールの履歴の管理ページが追加されます。
*/

class mailform extends template_type{
	public static function get_embeddables($conf_data){
		return ['form'=>['メールフォーム'=>'form.php']];
	}
	public static function get_menus($conf_data){
		return [
			'top'=>[
				$conf_data['label']=>$conf_data['alias_path'],
			],
			$conf_data['alias_path']=>[
				__('メール設定','catpow')=>$conf_data['meta']['conf']['alias_path'],
				__('フォーム設定','catpow')=>$conf_data['meta']['forms']['alias_path']
			]
		];
	}
	public static function get_template_files($conf_data){
		return array_merge([
			'form.php'=>[
				'',
				'@catpow',
				'@inputs 0',
				'<?php §message(); ?>',
				'@button center mail:送信:send',
			],
			'form-send.php'=>[
				'',
				[
					'php',
					'namespace Catpow;',
					'receive();',
					'push();',
					"foreach(meta('conf')->value as \$conf){\\cp::send_mail(\$conf);}",
				],
				'@outputs 0',
				['.message','お問い合わせありがとうございます、メールを送信しました']
				
			],
			'admin.php'=>['php',
				'namespace Catpow;',
				'clear(3);',
				"§sec('search');"
			],
			'sec_search.php'=>['',
				['php',
				 	'namespace Catpow;',
				 	"\cp::enqueue_style('blocks/section/front_style.css');",
				 	"wp_enqueue_script('cp_search');"
				],
				['#cp_search',
				 	['#cpcf_custom_box',
					 	['#cpcf_custom_box_button.button'],
					 	['.inside',
						 	'@inputs_search',
						 	['ul.buttons',['li.primary',['php',"button('検索','results','update_results');"]]]
						]
					]
				],
				['section.wp-block-catpow-section.article.header.level4',
				 	['div.contents',
					 	['header',
						 	['h2',"<?= _('メール一覧'); ?>"]
						],
					 	['div.text',
							['php','§results();'],
							['php','§message();']
						]
					]
					
				]
			],
			'sec_search-results.php'=>[
				'',[
					'php',
					'namespace Catpow;',
					'receive();'
				],
				'@loop_manage_table',
			]
		],manage::get_manage_table_template_files($conf_data));
	}
	
    public static function get_form_type($file){
		switch($file){
			case 'form.php':
			case 'form-send.php':
				return 1;
			case 'admin.php':
			case 'sec_search.php':
			case 'sec_search-results.php':
				return 4;
			default:
				return parent::get_form_type($file);
		}
    }
}

?>