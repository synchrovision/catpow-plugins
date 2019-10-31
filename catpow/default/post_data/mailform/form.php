<?php ob_start(); ?>
<!-- wp:catpow/simpletable -->
<table class="wp-block-catpow-simpletable inputs"><tbody><?php
	foreach($conf_data['meta']['mail']['meta'] as $name=>$conf){
		$classes='item';
		if($conf['required']){$classes.=' required';}
		else{$classes.=' optional';}
		echo "<tr class=\"{$classes}\"><th>{$conf['label']}</th><td>[input {$name}]</td></tr>";
	}
?></tbody></table>
<!-- /wp:catpow/simpletable -->

<!-- wp:catpow/formbuttons -->
<ul class="wp-block-catpow-formbuttons buttons"><li class="item primary check">[button 確認
 confirm]</li></ul>
<!-- /wp:catpow/formbuttons -->

<?php
$post_data['post_content']=ob_get_clean();