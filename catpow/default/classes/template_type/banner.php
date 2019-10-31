<?php
namespace Catpow\template_type;
/**
* 
*/

class banner extends template_type{
	public static function get_embeddables($conf_data){
		return ['loop'=>['バナー'=>'loop.php']];
	}
	public static function get_template_files($conf_data){
		$path_data=\cp::parse_conf_data_path($conf_data['path']);
		return [
			'loop.php'=>[
				'',
				'@catpow',[
					'ul.banner.'.$path_data['data_name'],
					'<?php foreach(loop() as $obj): ?>',[
						'li.item',
						'@image',
						['div.text',['h3','@title'],['p','@desc']],
						'@link'
					],
					'<?php endforeach; ?>'
				]
			]
		];
	}
}

?>