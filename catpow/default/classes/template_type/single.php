<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class single extends template_type{
	public static $permalinks=['single'];
	public static function get_default_post_datas($conf_data){
		if($conf_data['data_type']==='page'){
			$name=$conf_data['page_name'];
			$prm=[];
			if(isset($conf_data['label'])){$prm['post_title']=$conf_data['label'];}
			if(isset($conf_data['parent'])){$name=$conf_data['parent'].'/'.$name;}
			return ['page/'.$name=>$prm];
		}
		return [];
	}
	public static function get_template_files($conf_data){
		return [
			'index.php'=>['','@catpow','@page_content'],
			'header.php'=>['','@catpow','@page_header'],
			'footer.php'=>['','@catpow','@page_footer'],
			'style.scss'=>['@config'],
			'script.js'=>[],
		];
	}
}

?>