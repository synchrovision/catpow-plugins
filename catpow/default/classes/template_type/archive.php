<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class archive extends template_type{
	public static $permalinks=['archive'];
	public static function get_template_files($conf_data){
		return [
			'index.php'=>['','@catpow','@page_content'],
			'header.php'=>['','@catpow','@page_header'],
			'footer.php'=>['','@catpow','@page_footer'],
			'sidebar.php'=>['','@catpow','@sidebar'],
			'style.scss'=>['@config'],
			'script.js'=>[],
		];
	}
}

?>