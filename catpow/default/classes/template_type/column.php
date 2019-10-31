<?php
namespace Catpow\template_type;
/**
* 
*/

class column extends template_type{
	public static function get_embeddables($conf_data){
		return ['loop'=>['コラム'=>'loop.php']];
	}
	public static function get_template_files($conf_data){
		return [
			'loop.php'=>['','@catpow'],
		];
	}
}

?>