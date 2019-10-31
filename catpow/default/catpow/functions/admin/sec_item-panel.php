<?php
namespace Catpow;
if($f=cp::get_file_path('functions/'.this()->data_name.'/panel.php')){include $f;}
§results();
?>
<ul class="buttons cp_lightbox_control">
    <li class="close"><?php button('','close','lightbox_close'); ?></li>
</ul>
