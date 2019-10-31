<?php
$role=explode('-',$path_data[1])[1];
$post_data['meta']=[
	'clear'=>[1],
	'receive'=>[1],
	'push'=>[-1],
	'send_mail'=>[],
	'check_task'=>[1]
];
ob_start();
?>
<!-- wp:catpow/simpletable -->
<table class="wp-block-catpow-simpletable inputs"><tbody><?php
	foreach($GLOBALS['user_datas'][$role]['meta'] as $name=>$conf){
		$classes='item';
		if($conf['required']){$classes.=' required';}
		else{$classes.=' optional';}
		echo "<tr class=\"{$classes}\"><th>{$conf['label']}</th><td>[output {$name}]</td></tr>";
	}
?></tbody></table>
<!-- /wp:catpow/simpletable -->

<?php
$post_data['post_content']=ob_get_clean();