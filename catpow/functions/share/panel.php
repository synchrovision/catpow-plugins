<?php namespace Catpow;?>
<dl>
	<dt><i class="fa fa-share-alt"></i>設定</dt>
	<dd><?php input('config'); ?></dd>
</dl>
<ul class="buttons">
	<li class="edit"><?php button('更新','action','message'); ?></li>
</ul>
<?php §message(); ?>