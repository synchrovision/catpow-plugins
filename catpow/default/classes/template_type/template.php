<?php
namespace Catpow\template_type;
/**
* 柔軟なWP APIとwp_componentの連携テンプレート
*/

class template extends template_type{
	
	public static function get_embeddables($conf_data){return [];}
	public static function get_menus($conf_data){
		return [
			'sub'=>[
				'テンプレート'=>$conf_data['data_name'].'_template'
			]
		];
	}
    public static function fill_conf_data(&$conf_data){
		$template_post_type=$conf_data['data_name'].'_template';
		if(!isset($GLOBALS['post_types'][$template_post_type])){
			$GLOBALS['post_types'][$template_post_type]=[
				'label'=>'テンプレート',
				'public'=>false,
				'show_in_menu'=>false,
			];
			\cp::fill_conf_data('post',$template_post_type,$GLOBALS['post_types'][$template_post_type]);
		}
    }
}

?>