<?php
namespace Catpow\meta;

class post_status extends post_title{
	
	public static function reflect_to_query(&$query,$data_type,$data_name,$meta_name,$id,$input,$conf){
		if(empty(array_filter($input['value']))){return false;}
		$query['post_status']=$input['value'];
	}
}
?>