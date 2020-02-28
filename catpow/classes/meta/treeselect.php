<?php
namespace Catpow\meta;

class TreeSelect extends UI{
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return self::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value,$prm);
	}
	
	public static function get_selections($meta){
		if(isset($meta->conf['value'])){
        	$rtn=is_callable($meta->conf['value'])?$meta->conf['value']($meta):$meta->conf['value'];
		}
		else{$rtn=[];}
        if(isset($meta->conf['addition'])){
            if(is_array($meta->conf['addition'])){$rtn=array_merge($rtn,$meta->conf['addition']);}
            else{$rtn[$meta->conf['addition']]=0;}
        }
        return $rtn;
	}
}
?>