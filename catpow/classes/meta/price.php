<?php
namespace Catpow\meta;

class price extends meta{
    public static
        $value_type='NUMERIC',
        $data_type='FLOAT',
        $validation=['number'];
	
	public static function output($meta,$prm){
        return number_format($meta->value);
	}
}
?>