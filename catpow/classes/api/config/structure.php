<?php
namespace Catpow\api\config;
/**
* APIのエンドポイントのクラス
*/

class structure extends \Catpow\api{
	public static function call($req,$res){
		$data=[];
		\cp::conf_data_walk(function($data_type,$data_name,$conf_data)use(&$data){
			$data[$data_type][]=[
				'name'=>$data_name,
				'meta'=>self::get_structure($conf_data)
			];
		});
		$res->set_data($data);
	}
	public static function get_structure($conf_data){
		$rtn=[];
		if(!empty($conf_data['meta'])){
			foreach($conf_data['meta'] as $key=>$child_conf_data){
				$rtn[]=[
					'name'=>$key,
					'label'=>$child_conf_data['label'],
					'type'=>$child_conf_data['type'],
					'meta'=>self::get_structure($child_conf_data)
				];
			}
		}
		return $rtn;
	}
	public static function permission($req){
		return true;
	}
}

?>