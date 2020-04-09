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
		return [
			'admin.php'=>'default',
			'sec_search.php'=>'default',
			'sec_search-results.php'=>'default',
			'sec_manage_item.php'=>'default',
			'sec_manage_item-edit.php'=>'default'
		];
	}
}

?>