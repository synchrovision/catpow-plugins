<?php
namespace Catpow\template_type;
/**
* 柔軟なWP APIとwp_componentの連携テンプレート
*/

class compose extends template_type{
	public static function get_embeddables($conf_data){
		return [
			'snippet'=>[
				'compose'=>'render.php',
			]
		];
	}
	public static function get_rest_routes($conf_data){
		return ['response'=>'response.php'];
	}
	public static function get_template_files($conf_data){
		return [
			'render.php'=>[
				'',
				[
					'php',
					'namespace Catpow;',
					"cp::enqueue_script('{$conf_data['path']}/compose/component.js',['wp-element','babelHelpers','wp-api-fetch','catpow']);",
					"cp::enqueue_script('{$conf_data['path']}/compose/script.js',['catpow']);",
				],
				['div#compose[data-nonce="<?=wp_create_nonce(\'wp_rest\');?>" data-api-path="/cp/v1/'.$conf_data['path'].'/compose/response"]']
			],
			'response.php'=>'default',
			'script.js'=>'default',
			'component.jsx'=>'default',
			'component.js'=>'default',
		];
	}
}

?>