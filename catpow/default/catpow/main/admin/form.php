<?php
namespace Catpow;
global $use_functions;
?>
<div class="cp_form_section">
	<ul class="functions active">
		<?php foreach($use_functions as $i=>$fnc):?>
		<li class="item"><?php §sec('catpow/'.$fnc.'/admin/sec_item.php',1); ?></li>
		<?php endforeach; ?>
	</ul>
</div>