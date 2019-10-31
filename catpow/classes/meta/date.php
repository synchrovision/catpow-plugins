<?php
namespace Catpow\meta;

class date extends meta{
    public static
        $validation=['text','date'];
    
	public static function output($meta,$prm){
        $val=$meta->value;
		if(empty($prm)){return \Catpow\calendar::dates_to_str($val);}
		if($prm=='time'){return strtotime($val);}
        return date($prm,strtotime($val));
	}
}
?>