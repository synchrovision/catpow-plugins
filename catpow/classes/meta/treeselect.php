<?php
namespace Catpow\meta;

class treeselect extends meta{
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return self::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value,$prm);
	}
	
	public static function get_selections($meta){
		if(isset($meta->conf['value'])){
        	$rtn=is_callable($meta->conf['value'])?$meta->conf['value']($meta):$meta->conf['value'];
		}
		else{$rtn=[];}
        if(isset($meta->conf['addition'])){
            if(is_array($meta->conf['addition'])){$rtn=array_merge($rtn,$meta->conf['addition']);}
            else{$rtn[$meta->conf['addition']]=0;}
        }
        return $rtn;
	}
    
    public static function get_input($path,$conf,$sels,$val,$prm){
		\cp::enqueue_style('ui/TreeSelect/style.css');
		\cp::enqueue_script('ui/HiddenValues/component.js',['wp-element','babelHelpers']);
		\cp::enqueue_script('ui/TreeSelect/component.js',['ui/HiddenValues/component.js']);
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
							'name'=>\cp::get_input_name($path),
							'param'=>$prm
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