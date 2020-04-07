<?php
namespace Catpow\template_item\php;
/**
* カスタムヘッダーイメージ
*/

class file extends \Catpow\template_item\php{
	public static function get_code_data($path_data,$conf_data,$param){
		$file=file(\cp::get_file_path('classes/template_item/php/file/'.$param));
		return $file;
	}
}

?>