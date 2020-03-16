<?php
$conf=[
	'cat'=>'payment',
	'meta'=>[
		'cp_amazonpay_keys'=>['type'=>'options','option'=>'cp_amazonpay_keys','meta'=>[
			'sandbox'=>['type'=>'radio','value'=>['テスト環境'=>1,'本番環境'=>-1]],
			'merchant_id'=>['type'=>'text','label'=>'出品者ID'],
			'access_key'=>['type'=>'text','label'=>'アクセスキーID','size'=>50],
			'secret_key'=>['type'=>'text','label'=>'シークレットアクセスキー','size'=>50],
			'client_id'=>['type'=>'text','label'=>'クライアントID','size'=>50],
			'client_secret'=>['type'=>'text','label'=>'クライアントシークレット','size'=>50],
			//'type'=>['type'=>'radio','label'=>'タイプ','value'=>['ログイン'=>'LwA','決済'=>'PwA']],
			'color'=>['type'=>'radio','label'=>'色','value'=>['ゴールド'=>'Gold','ライト'=>'LightGray','ダーク'=>'DarkGray']],
			'size'=>['type'=>'radio','label'=>'サイズ','value'=>['小'=>'small','中'=>'medium','大'=>'large','極大'=>'x-large']],
			'addressbook'=>['type'=>'radio','value'=>['なし'=>-1,'あり'=>1]]
		]]
	]
];