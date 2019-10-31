<?php
namespace Catpow\template_type;
/**
* テンプレートの情報
* テンプレート生成・パーマリンク生成時に使用される
*/

class register extends template_type{
	public static $permalinks=['archive','task'];
	public static function get_embeddables($conf_data){
		return ['form'=>['登録'=>'form.php']];
	}
	public static function get_menus($conf_data){
		return [
			'sub'=>[
				'登録フォーム'=>'register_form',
				'登録メール'=>'register_mail'
			]
		];
	}
	public static function fill_conf_data(&$conf_data){
		if(!isset($GLOBALS['post_types']['register_form'])){
			$GLOBALS['post_types']['register_form']=[
				'label'=>'登録フォーム',
				'public'=>false,
				'show_in_menu'=>false,
				'hierarchical'=>true,
				'meta'=>[
					'name'=>['type'=>'post_name','label'=>'名前'],
					'clear'=>['type'=>'checkbox','label'=>'クリア','value'=>['入力検証'=>1,'入力値'=>2,'フォーム'=>4]],
					'receive'=>['type'=>'radio','label'=>'データ受信','value'=>['しない'=>-1,'する'=>1]],
					'push'=>['type'=>'radio','label'=>'登録処理','value'=>['しない'=>-1,'する'=>1]],
					'send_mail'=>['type'=>'checkbox_post_datas','label'=>'メール送信','value'=>'register_mail'],
					'check_task'=>['type'=>'radio','label'=>'タスク完了確認','value'=>['しない'=>-1,'する'=>1]]
				]
			];
			\cp::fill_conf_data('post','register_form',$GLOBALS['post_types']['register_form']);
		}
		if(!isset($GLOBALS['post_types']['register_mail'])){
			$GLOBALS['post_types']['register_mail']=[
				'label'=>'登録メール',
				'public'=>false,
				'show_in_menu'=>false,
				'richedit'=>false,
				'meta'=>[
					'name'=>['type'=>'post_name','label'=>'名前'],
					'to'=>['type'=>'text','label'=>'送信先'],
					'from'=>['type'=>'text','label'=>'送信元'],
					'type'=>['type'=>'radio','label'=>'メールタイプ','value'=>['plain','html']]
				]
			];
			\cp::fill_conf_data('post','register_mail',$GLOBALS['post_types']['register_mail']);
		}
	}
    public static function get_default_post_datas($conf_data){
		$name=basename($conf_data['path']);
		return [
			'register_form/form-'.$name=>['post_title'=>$conf_data['label'].'登録フォーム'],
			'register_form/form-'.$name.'/step1'=>['post_title'=>'Step1'],
			'register_form/form-'.$name.'/step2'=>['post_title'=>'Step2'],
			'register_form/form-'.$name.'/step3'=>['post_title'=>'Step3'],
			'register_mail/confirm-'.$name=>['post_title'=>$conf_data['label'].'登録確認'],
			'register_mail/thanks-'.$name=>['post_title'=>$conf_data['label'].'登録完了'],
			'register_mail/notice-'.$name=>['post_title'=>$conf_data['label'].'登録通知'],
		];
	}
	public static function get_template_files($conf_data){
		$name=basename($conf_data['path']);
		return [
			'index.php'=>['',[
				'php',
				'namespace Catpow;',
				"§form();"
			]],
			'form.php'=>['',[
				'php',
				'namespace Catpow;',
				"\$path='register_form/form-{$name}';",
				"if(!empty(\$action) && \$action !== 'form'){\$path.='/'.\$action;}",
				'$post_data=cp::get_post_data($path);',
				"if(\$post_data['meta']['receive'][0]==1){receive();}",
				"if(\$post_data['meta']['push'][0]==1){push();}",
				"if(\$post_data['meta']['check_task'][0]==1 && !task()->load()->is_completed()){",[
					"form()->error('確認メールのURLにアクセスしてください');"
				],"}",
				"if(!empty(\$post_data['meta']['send_mail'])){cp::send_mails(\$post_data['meta']['send_mail']);}",
				"if(isset(\$post_data['meta']['clear'])){clear(array_sum(\$post_data['meta']['clear']));}",
				'§message();',
				'content($path);'
			]],
			'task.php'=>['',[
				'php',
				'namespace Catpow;',
				'this()->complete();',
				'echo "メールの受信を確認しました、";'
			]],
			'header.php'=>['','@catpow','@page_header'],
			'footer.php'=>['','@catpow','@page_footer'],
			'style.scss'=>['@config'],
			'script.js'=>[],
		];
	}
}

?>