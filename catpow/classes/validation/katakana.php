<?php
namespace Catpow\validation;

class katakana extends pattern{
    public static $pattern='/^[ァ-ヶー\s]+$/u';
	
	public static function get_message_format($meta){
		return __('カタカナで入力してください','catpow');
	}
}

?>