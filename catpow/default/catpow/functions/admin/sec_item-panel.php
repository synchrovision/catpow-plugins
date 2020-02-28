<?php
namespace Catpow;
if($f=cp::get_file_path('functions/'.this()->data_name.'/panel.php')){include $f;}
§results();
?>
<ul class="wp-block-catpow-buttons">
	<li class="item close"><?php button('','close','lightbox_close'); ?></li>
</ul>
