<?php
namespace Catpow\meta;

class TreeSelect extends UI{
	static $ui='TreeSelect';
	public static function fill_param($prm,$meta){
		$prm=parent::fill_param($prm,$conf);
		$prm['selections']=static::get_selections($meta);
		return $prm;
	}
	
	public static function get_selections($meta){
		return select::get_selections($meta);
	}
}
?>