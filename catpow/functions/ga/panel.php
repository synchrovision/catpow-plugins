<?php namespace Catpow;?>
<dl>
	<dt><i class="fa fa-google"></i>GoogleAnalyticsコード</dt>
	<dd><?php input('cp_ga_code'); ?></dd>
</dl>
<ul class="buttons">
	<li class="edit"><?php button('登録','action','message'); ?></li>
</ul>
<?php §message(); ?>