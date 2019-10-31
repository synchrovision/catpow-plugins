<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class editor extends template_type{
	public static function get_template_files($conf_data){
		return [
			'loop.php'=>['','@catpow'],
			'loop_item.php'=>['','@catpow'],
			'form_step1.php'=>['','@catpow'],
			'form_step2.php'=>['','@catpow'],
			'form_step3.php'=>['','@catpow'],
		];
	}
}

?>