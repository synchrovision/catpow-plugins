<?php
$role=explode('-',$path_data[1])[1];
$post_data['meta']=[
	'clear'=>[1],
	'receive'=>[1],
	'push'=>[-1],
	'send_mail'=>['register_mail/confirm-'.$role],
	'check_task'=>[-1]
];
ob_start();
?>
<!-- wp:catpow/section -->
<section class="wp-block-catpow-section center column round thin_border check"><div class="contents"><header><div class="title"><h2><?=$GLOBALS['user_datas'][$role]['label']?>登録</h2></div></header><div class="text">
<!-- wp:paragraph -->
<p class="has-regular-font-size">確認メールを送信しました。メールに記載されているURLにアクセスしてから次のステップへ進んでください。</p>
<!-- /wp:paragraph -->

<!-- wp:catpow/formbuttons -->
<ul class="wp-block-catpow-formbuttons buttons"><li class="item primary check">[button 次へ step2]</li></ul>
<!-- /wp:catpow/formbuttons --></div></div></section>
<!-- /wp:catpow/section -->


<?php
$post_data['post_content']=ob_get_clean();