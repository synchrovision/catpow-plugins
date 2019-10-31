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
	public static function get_template_files($conf_data){
		$path_data=\cp::parse_conf_data_path($conf_data['path']);
		return [
			'loop.php'=>[
				'',
				[
                    'php',
                    'namespace Catpow;',
				    "cp::enqueue_script('{$conf_data['path']}/finder/component.js',['wp-element','wp-api-fetch','catpow']);",
				    "cp::enqueue_script('{$conf_data['path']}/finder/script.js',['catpow']);",
                ],
				['div#finder']
			],
            'script.js'=>'default',
            'component.js'=>'default',
            'component.jsx'=>'default'
		];
	}
}

?>