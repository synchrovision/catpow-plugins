<?php
namespace Catpow\data_type;

class nav extends data_type{
    public static $data_type='post';
	public static function get_default_templates($conf){
		if(empty($conf['meta'])){return ['menu'];}
		return ['menu','admin'];
	}
}

?>