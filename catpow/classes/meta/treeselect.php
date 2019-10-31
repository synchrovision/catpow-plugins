<?php
namespace Catpow\meta;

class treeselect extends select{
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return self::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
    
    public static function get_input($path,$conf,$sels,$val){
		\cp::enqueue_style('ui/treeSelect/style.css');
		\cp::enqueue_script('ui/treeSelect/component.js',['wp-element','babelHelpers']);
		$id=\cp::get_input_id($path);
		ob_start();
		?>
		<div<?=\cp::get_item_attr($path,$conf)?>>
			<script type="text/javascript">
				jQuery(function($){
					wp.element.render(
						wp.element.createElement(TreeSelect,<?=json_encode([
							'selections'=>$sels,
							'value'=>$val,
							'name'=>\cp::get_input_name($path)
						])?>),
						document.getElementById("<?=$id?>")
					);
				});
			</script>
		</div>
		<?php
        return ob_get_clean();
    }
}
?>