<?php
namespace Catpow\template_type;
/**
* 
*/

class contact extends template_type{
	public static function get_embeddables($conf_data){
		return [
			'loop'=>[
				__('連絡先','catpow')=>'loop.php'
			]
		];
	}
	public static function get_template_files($conf_data){
		return [
			'loop.php'=>[
				'',
				'@catpow',[
					'ul.contact',
					'<?php foreach(loop() as $obj): ?>',[
						'li.item',
						['h3',in_array('single',$conf_data['template'])?['a[href="<?=url();?>"]','@title']:'@title'],
						'@contact'
					],
					'<?php endforeach; ?>'
				]
			]
		];
	}
}

?>