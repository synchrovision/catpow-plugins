<?php
/*カスタム投稿の設定*/
$post_types=[
	'post'=>[
		'label'=>'お知らせ',
		'taxonomies'=>[
			'div'=>['label'=>'分類']
		],
		'meta'=>[
			'desc'=>['type'=>'textarea','label'=>'概要'],
			'image'=>['type'=>'media','label'=>'画像']
		],
		'supports'=>['title','thumbnail'],
		'template'=>['listed','archive','single']
	],
	'attachment'=>[
		'meta'=>[
			'test'=>['type'=>'text'],
			'alt_image'=>['type'=>'media_sp']
		]
	]
];

/*固定ページの設定*/
$static_pages=[
	'home'=>[
		'label'=>'ホーム',
		'meta'=>[
			'image'=>['type'=>'media','label'=>'画像']
		]
	]
];

/*ウィジェットエリアの設定*/
$sidebar_datas=[
	'side'=>[]
];

/*メニューの設定*/
$nav_datas=[
	'primary'=>[
		'label'=>'プライマリー',
		'meta'=>[
			'icon'=>['type'=>'image','label'=>'アイコン']
		],
		'template'=>['admin','menu']
	],
	'header'=>[
		'label'=>'ヘッダー',
		'meta'=>[
			'icon'=>['type'=>'image','label'=>'アイコン']
		],
		'template'=>['admin','menu']
	],
	'side'=>['labe'=>'サイド'],
	'footer'=>['labe'=>'フッター'],
	'sitemap'=>['label'=>'サイトマップ',
		'meta'=>[
			'image'=>['type'=>'image','label'=>'イメージ']
		],
		'template'=>['admin','menu']
	]
];


/*ユーザ情報の設定*/
$user_datas=[
	'guest'=>[
		'meta'=>[],
		'template'=>['single','search','register','edit']
	]
];
/*サイト情報の設定*/
$site_datas=[
	'site_config'=>[
		'meta'=>[
			'test'=>['type'=>'text','label'=>'test']
		],
	]
];