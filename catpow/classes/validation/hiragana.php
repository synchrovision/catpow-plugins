<?php
namespace Catpow\validation;

class hiragana extends pattern{
	public static $pattern='/^[ぁ-ん\s]+$/u';
	
	public static function get_message_format($meta){
		return __('ひらがなで入力してください','catpow');
	}
}

?>