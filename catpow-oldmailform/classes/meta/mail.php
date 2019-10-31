<?php
namespace Catpow\meta;
/**
* メールフォーム
*/
class mail extends database{
	static $has_parent=false;
    
	public static function fill_conf(&$conf){
		$conf=array_merge([
			'meta'=>[],'alias'=>'mails','alias_template'=>['mailform']
		],$conf);
		$conf['meta']=array_merge([
			'name'=>['type'=>'text','label'=>__('お名前','catpow')],
			'email'=>['type'=>'email','label'=>__('メールアドレス','catpow'),'required'=>1],
			'conf'=>[
				'type'=>'share',
				'label'=>__('メール設定','catpow'),
				'meta'=>[],
				'multiple'=>true,
				'alias'=>$conf['alias'].'conf',
				'alias_template'=>['mailconf']
			]
		],$conf['meta']);
		$conf['meta']['conf']['meta']=array_merge([
			'subject'=>['type'=>'text','label'=>__('件名','catpow'),'size'=>36],
			'to'=>['type'=>'text','label'=>__('宛先','catpow'),'size'=>24],
			'from'=>['type'=>'text','label'=>__('送信元','catpow'),'size'=>24],
			'reply_to'=>['type'=>'text','label'=>__('返信先','catpow'),'size'=>24],
			'cc'=>['type'=>'text','label'=>__('CC','catpow'),'size'=>24],
			'bcc'=>['type'=>'text','label'=>__('BCC','catpow'),'size'=>24],
			'message'=>['type'=>'textarea','label'=>__('メール本文','catpow'),'rows'=>20,'cols'=>36]
		],$conf['meta']['conf']['meta']);
	}
}
?>