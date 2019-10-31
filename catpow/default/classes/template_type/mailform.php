<?php
namespace Catpow\template_type;
/**
* メールフォームのテンプレート
* ブロックとして記事本文中に埋め込んで使用します。
* article_type/mailformのmailのtemplateとして使用されることを想定しており、
* 単独での使用を想定しません
*/

class mailform extends template_type{
	public static function get_embeddables($conf_data){
		$post_data_paths=[];
		return [
			'form'=>['メールフォーム'=>[
				'file'=>'form.php',
				'post_data_paths'=>$post_data_paths
			]]
		];
	}
	public static function get_template_files($conf_data){
		$form_post_type=$conf_data['data_name'];
		return[
			'form.php'=>[
				'php',
				'namespace Catpow;',
				"\$path=this()->conf['form'];",
				"if(!empty(\$action) && \$action !== 'form'){\$path.='/'.\$action;}",
				'$post_data=cp::get_post_data($path);',
				"if(\$post_data['meta']['receive'][0]==1){receive();}",
				"if(\$post_data['meta']['push'][0]==1){push();}",
				"if(!empty(\$post_data['meta']['send_mail'])){cp::send_mails(\$post_data['meta']['send_mail']);}",
				"if(isset(\$post_data['meta']['clear'])){clear(array_sum(\$post_data['meta']['clear']));}",
				'content($path);',
				'§message();'
			]
		];
	}
	
    public static function get_form_type($file){
		switch($file){
			case 'form.php':
				return 1;
			default:
				return parent::get_form_type($file);
		}
    }
}

?>