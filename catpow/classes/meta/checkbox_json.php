<?php
namespace Catpow\meta;

class checkbox_json extends select_json{
	public static
		$is_bulk_input=true;
	
	public static function input($meta,$prm){
		$sels=self::get_selections($meta);
		return checkbox::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
}
?>