<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class edit extends template_type{
	public static $permalinks=['single'];
	public static function get_template_files($conf_data){
		return [
			'index.php'=>['','@catpow'],
			'form_step1.php'=>['','@catpow'],
			'form_step2.php'=>['','@catpow'],
			'form_step3.php'=>['','@catpow'],
			'header.php'=>['','@catpow'],
			'footer.php'=>['','@catpow'],
			'sidebar.php'=>['','@catpow'],
			'style.scss'=>[],
			'script.js'=>[],
		];
	}
}

?>