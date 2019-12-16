<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class admin extends template_type{
	public static function get_template_files($conf_data){
		return [
			'form.php'=>['','@catpow',"<?php cp::enqueue_style('blocks/simpletable/front_style.css'); ?>",'@inputs 3'],
			'search.php'=>['','@catpow','@inputs_search'],
			'style.scss'=>[],
			'script.js'=>[],
		];
	}
}

?>