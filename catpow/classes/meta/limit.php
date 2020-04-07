<?php
namespace Catpow\meta;

class limit extends number{
	public static function reflect_to_query(&$query,$data_type,$data_name,$meta_name,$id,$input,$conf){
		$query['limit']=$input['value'][0];
	}
}
?>