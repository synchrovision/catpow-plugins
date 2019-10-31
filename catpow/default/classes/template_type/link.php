<?php
namespace Catpow\template_type;
/**
* 
*/

class link extends template_type{
	public static function get_embeddables($conf_data){
		return ['loop'=>['リンク'=>'loop.php']];
	}
	public static function get_template_files($conf_data){
		$path_data=\cp::parse_conf_data_path($conf_data['path']);
		return [
			'loop.php'=>[
				'',
				'@catpow',[
					'ul.wp-block-catpow-listed.menu.'.$path_data['data_name'],
					'<?php foreach(loop() as $obj): ?>',[
						'li',
						['header',['div.text',['h3','@title']]],
						['div.contents',
							'@image medium',
							['div.text',['p','@desc']],
						 	'@link'
						],
					],
					'<?php endforeach; ?>'
				]
			]
		];
	}
}

?>