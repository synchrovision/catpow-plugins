<?php
namespace Catpow\template_type;
/**
* 
*/

class app extends template_type{
	public static $app_name='App';
	public static function get_embeddables($conf_data){
		return ['app'=>[static::$app_name=>'config']];
	}
}

?>