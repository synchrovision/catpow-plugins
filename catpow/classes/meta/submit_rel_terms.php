<?php
namespace Catpow\meta;

class submit_rel_terms extends select_rel_terms{
	public static function input($meta,$prm){
		$sels=self::get_selections($meta);
		return submit::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
}
?>