<?php
namespace Catpow\meta;

class DateSelect extends UI{
	public static $output_type='date';
	public static function fill_param($prm,$conf){
		$prm=(array)$prm;
		if(isset($conf['min'])){$prm['min']=date('Y-m-d',strtotime($conf['min']));}
		if(isset($conf['max'])){$prm['max']=date('Y-m-d',strtotime($conf['max']));}
		return parent::fill_param($prm,$conf);
	}
}
?>