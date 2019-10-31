<?php
namespace Catpow\template_type;
/**
* 
*/

class access extends template_type{
	public static function get_embeddables($conf_data){
		return [
			'loop'=>[
				__('アクセス','catpow')=>'loop.php'
			]
		];
	}
	public static function get_template_files($conf_data){
		return [
			'loop.php'=>[
				'',
				'@catpow',[
					'ul.access',
					'<?php foreach(loop() as $obj): ?>',[
						'li.item',
						'@image',[
							'div.text',
							['h3','@title'],
							'@access',
						],
						'@map'
					],
					'<?php endforeach; ?>'
				]
			]
		];
	}
}

?>