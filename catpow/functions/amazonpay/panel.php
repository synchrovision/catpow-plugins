<?php namespace Catpow;?>
<dl>
	<dt><i class="fa fa-amazon-pay"></i>MWSアクセスキー</dt>
	<dd>
		<?php foreach(loop('cp_amazonpay_keys') as $vals): ?>
		<p><?php input('sandbox'); ?></p>
		<p>merchant_id:<?php input('merchant_id'); ?></p>
		<p>access_key:<?php input('access_key'); ?></p>
		<p>secret_key:<?php input('secret_key'); ?></p>
		<p>client_id:<?php input('client_id'); ?></p>
		<p>client_secret:<?php input('client_secret'); ?></p>
		<p><?php input('color'); ?></p>
		<p><?php input('size'); ?></p>
		<?php endforeach; ?>
		<p>
			<a href="https://sellercentral-japan.amazon.com/home" target="_blank">AmazonSellerCentral</a>にてアプリケーションを登録し
			ウェブ設定のJavaScriptの種類に<code><?=home_url();?></code>、リダイレクトURLに<code><?=home_url('/callback/amazonpay/checkout/');?></code>を設定し
			各キー取得して入力してください
		</p>
	</dd>
</dl>
<ul class="buttons">
	<li class="edit"><?php button('登録','action','message'); ?></li>
</ul>
<?php §message(); ?>