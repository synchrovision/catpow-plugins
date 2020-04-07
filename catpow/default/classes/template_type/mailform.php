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
		global $wpdb;
		$post_data_paths=[];
		$path_data=(\cp::parse_conf_data_path($conf_data['path']));
		$posts=get_posts([
			'post_type'=>$path_data['data_name'],
			'post_parent'=>0
		]);
		if(empty($posts)){
			$post_datas=\Catpow\article_type\mailform::get_default_post_datas($GLOBALS['post_types'][$path_data['data_name']]);
			foreach($post_datas as $path=>$post_data){
				if(substr_count($path,'/')>1){continue;}
				$post_data_paths[$path]=$post_data['post_title'];
			}
		}
		else{
			foreach($posts as $post){
				$post_data_paths[$post->post_type.'/'.$post->post_name]=$post->post_title;
			}
		}
		
		return [
			'form'=>['メールフォーム'=>[
				'file'=>'form.php',
				'post_data_paths'=>$post_data_paths
			]]
		];
	}
	public static function get_template_files($conf_data){
		return[
			'form.php'=>[
				'php',
				'namespace Catpow;',
				"if(isset(\$post_data_path)){inherit(['post_data_path'=>\$post_data_path]);}",
				"\$path=this()->post_data_path;",
				"if(!empty(\$action) && \$action !== 'form'){\$path.='/'.\$action;}",
				'$post_data=cp::get_post_data($path);',
				"if((\$post_data['meta']['receive'][0]??null)==1){receive();}",
				"if((\$post_data['meta']['push'][0]??null)==1){push();}",
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