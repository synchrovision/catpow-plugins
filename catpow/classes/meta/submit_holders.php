<?php
namespace Catpow\meta;

class submit_holders extends select_holders{
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return submit::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
}
?>