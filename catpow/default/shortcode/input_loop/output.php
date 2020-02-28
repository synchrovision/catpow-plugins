<?php
namespace Catpow;
$prm=shortcode_atts(array(0=>null),$atts);
if(cp::$content):
«($prm[0]);
?>
<div <?php _item(); ?>>
	<?php foreach(loop() as $obj): ?>
	<div <?php _unit(); ?>>
		<?=do_shortcode($content); ?>
		<?php controller(); ?>
	</div>
	<?php endforeach; ?>
</div>
<?php
»();
endif;
?>