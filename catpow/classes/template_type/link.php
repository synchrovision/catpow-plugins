<?php
namespace Catpow\template_type;
/**
* 
*/

class link extends template_type{
	public static function get_embeddables($conf_data){
		return ['loop'=>['リンク'=>'loop.php']];
	}
}

?>