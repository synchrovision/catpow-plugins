<?php
namespace Catpow\meta;

class DateSelect extends ui{
    public static $ui='DateSelect';
	
	public static function input($meta,$prm){
		$prm=(array)$prm;
		if(isset($meta->conf['min'])){$prm['min']=date('Y-m-d',strtotime($meta->conf['min']));}
		if(isset($meta->conf['max'])){$prm['max']=date('Y-m-d',strtotime($meta->conf['max']));}
        return self::get_input(
			$meta->the_data_path,$meta->conf,$prm,
			date('Y-m-d',strtotime(!empty($meta->value)?$meta->value:'now'))
		);
	}
}
?>