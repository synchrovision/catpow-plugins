<?php
namespace Catpow\article_type;
/**
* フォームから送信されるメールの送付先・タイトル・文面の設定
*/

class mailconf extends article_type{
	public function __construct($data_path,$conf,$data){
		
	}
	public static function fill_conf_data(&$conf_data){
		$conf_data=array_merge([
			'label'=>'メール設定',
			'public'=>false,
			'show_in_menu'=>false,
			'richedit'=>false,
			'meta'=>[
				'name'=>['type'=>'post_name','label'=>'名前'],
				'to'=>['type'=>'text','label'=>'送信先','size'=>30],
				'from'=>['type'=>'text','label'=>'送信元','size'=>30]
			]
		],$conf_data);
	}
	public static function get_default_post_datas($conf_data){
		return [
			$conf_data['data_name'].'/notice'=>[],
			$conf_data['data_name'].'/thanks'=>[],
		];
	}
}

?>