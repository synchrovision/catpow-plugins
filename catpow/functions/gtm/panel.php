<dl>
	<dt><i class="fa fa-google"></i>コンテナID</dt>
	<dd><?php input('cp_gtm_container_id'); ?></dd>
</dl>
<ul>
	<li>
		<p class="caption">
			<a href="https://tagmanager.google.com/" target="_blank">GoogleTagManager</a>で
			使用したいコンテナのIDを取得して入力してください。
		</p>
	</li>
</ul>

<ul class="buttons">
	<li class="edit"><?php button('登録','action','message'); ?></li>
</ul>
<?php §message(); ?>