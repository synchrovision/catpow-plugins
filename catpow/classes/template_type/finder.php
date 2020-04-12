<?php
namespace Catpow\template_type;
/**
* 
*/

class finder extends template_type{
	public static function get_embeddables($conf_data){
		return ['tool'=>['ファインダ'=>'loop.php']];
	}
	public static function get_rest_routes($conf_data){
		return [
			'test'=>function($req,$res){$res->set_data(['param'=>var_export(\cp::parse_content_path($req['content_path']),true)]);}
		];
	}
}

?>