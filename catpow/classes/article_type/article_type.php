<?php
namespace Catpow\article_type;
/**
* 記事タイプ
*/

abstract class article_type{
	public $data_path,$path_data,$conf,$data;
	public function __construct($data_path,$conf,$data){}
	public static function get_menus($conf_data){return [];}
	public static function fill_conf_data(&$conf_data){}
	public static function get_default_post_datas($conf_data){return [];}
	public function mod($key,$val){
		eval('$this->data["'.str_replace('/','"]["',$key).'"]=$val;');
		return $this;
	}
	public function save(){}
	public function load(){}
}

?>