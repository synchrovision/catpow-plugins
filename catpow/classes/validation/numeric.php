<?php
namespace Catpow\validation;

class numeric extends pattern{
	public static  $pattern='/^[\-+]?\d+(\.\d+)?$/';
	
	public static function get_message_format($meta){
		return __('数値で入力してください','catpow');
	}
}

?>