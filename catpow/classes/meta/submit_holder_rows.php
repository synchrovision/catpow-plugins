<?php
namespace Catpow\meta;

class submit_holder_rows extends select_holder_rows{
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return submit::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
}
?>