<?php
/**
 * @package Catpow
 * @version 1.0
 */
/*
Plugin Name: Catpow-litespeed
Description: Catpowのフォームをlitespeed cacheに対応させる
Author: synchro_vision
Version: 1.1
Author URI: https://twitter.com/synchro_vision
Text Domain: catpow
Domain Path: /languages
*/
add_filter('catpow_extensions',function($extensions){$extensions[]='catpow-litespeed';return $extensions;});


\LiteSpeed_Cache_API::hook_tpl_esi('render_cp_form',function($param){
	$form=$param['form'];
	wp_enqueue_script('cp_form');
	?>
	<form action="<?= home_url(); ?>" method="get" id="<?= $form->form_id ?>" class="cp_form" enctype="multipart/form-data">
		<?php wp_nonce_field('cp_form','_cp_form_nonce'); ?>
		<input type="hidden" name="cp_form_id" value="<?= $form->form_id ?>"/>
		<div class="cp_form_content">
			<?php $form->inc($param['slug'],$param['vars']); ?>
		</div>
	</form>
	<?php
	return $form;
});