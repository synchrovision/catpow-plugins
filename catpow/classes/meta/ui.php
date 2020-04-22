<?php
namespace Catpow\meta;

class UI extends meta{
	public static $ui=null,$input_type=false,$output_type=false,$inputDeps=[],$outputDeps=[],$defaultParam=[];
	
	public static function output($meta,$prm){
		if(static::$output_type===false){
			$prm=array_merge((array)$prm,['value'=>$meta->value]);
			return self::get_output($meta->the_data_path,$meta->conf,static::fill_param($prm,$meta));
		}
		$class_name=\cp::get_class_name('meta',static::$output_type);
		return $class_name::output($meta,$prm);
	}
	public static function input($meta,$prm){
		if(static::$input_type===false){
			$prm=array_merge((array)$prm,['value'=>$meta->value,'name'=>\cp::get_input_name($meta->the_data_path)]);
			return self::get_input($meta->the_data_path,$meta->conf,static::fill_param($prm,$meta));
		}
		$class_name=\cp::get_class_name('meta',static::$input_type);
		return $class_name::input($meta,$prm);
	}
	
	public static function fill_param($prm,$meta){
		$prm=(array)$prm;
		if(empty(static::$defaultParam)){return $prm;}
		
		return array_map(
			function($item)use($meta){
				if(is_callable($item)){return $item($prm,$meta);}
				return $item;
			},
			array_filter(
				array_merge(
					static::$defaultParam,
					array_intersect_key($meta->conf,static::$defaultParam),
					$prm
				),
				function($v){return isset($v);}
			)
		);
	}
	
	public static function get_output($path,$conf,$prm){
		$ui=$conf['ui']??static::$ui??static::get_type();
		if(!wp_script_is('ui/'.$ui.'/output.js')){
			\cp::enqueue_style('ui/'.$ui.'/output.css');
			$deps=['wp-element','babelHelpers'];
			foreach(static::$outputDeps as $dep){
				\cp::enqueue_style('ui/'.$dep.'/output.css');
				\cp::enqueue_script('ui/'.$dep.'/output.js',$deps);
				$deps[]='ui/'.$dep.'/output.js';
				if($f=\cp::get_file_path('ui/'.$dep.'/outputInit.php')){include $f;}
			}
			\cp::enqueue_script('ui/'.$ui.'/output.js',$deps);
			$enqueued=true;
		}
		if(isset($conf['outputDeps'])){
			foreach($conf['outputDeps'] as $dep){
				\cp::enqueue_style('ui/'.$dep.'/output.css');
				\cp::enqueue_script('ui/'.$dep.'/output.js');
				$GLOBALS['wp_scripts']->registered['ui/'.$ui.'/output.js']->deps[]='ui/'.$dep.'/output.js';
				if($f=\cp::get_file_path('ui/'.$dep.'/outputInit.php')){include $f;}
			}
		}
		if($f=\cp::get_file_path('ui/'.$ui.'/outputInit.php')){include $f;}
		$id=\cp::get_input_id($path).'--ui';
		
		
		ob_start();
		?>
		<div id="<?=$id?>" data-ui="<?=$ui?>">
			<script type="text/javascript">
				jQuery(function($){
					if(wp.element===undefined){console.error('wp.element not defined');return;}
					var el=document.getElementById("<?=$id?>");
					el.props=<?=json_encode($prm)?>;
					wp.element.render(wp.element.createElement(Catpow.<?=$ui?>,el.props),el);
				});
			</script>
		</div>
		<?php
		return ob_get_clean();
	}
	public static function get_input($path,$conf,$prm){
		$ui=$conf['ui']??static::$ui??static::get_type();
		if(!wp_script_is('ui/'.$ui.'/input.js')){
			\cp::enqueue_style('ui/'.$ui.'/input.css');
			\cp::enqueue_script('ui/HiddenValues/input.js',['wp-element','babelHelpers']);
			$deps=['ui/HiddenValues/input.js'];
			foreach(static::$inputDeps as $dep){
				\cp::enqueue_style('ui/'.$dep.'/input.css');
				\cp::enqueue_script('ui/'.$dep.'/input.js',$deps);
				$deps[]='ui/'.$dep.'/input.js';
				if($f=\cp::get_file_path('ui/'.$dep.'/inputInit.php')){include $f;}
			}
			\cp::enqueue_script('ui/'.$ui.'/input.js',$deps);
			$enqueued=true;
		}
		if(isset($conf['inputDeps'])){
			foreach($conf['inputDeps'] as $dep){
				\cp::enqueue_style('ui/'.$dep.'/input.css');
				\cp::enqueue_script('ui/'.$dep.'/input.js',['ui/HiddenValues/input.js']);
				$GLOBALS['wp_scripts']->registered['ui/'.$ui.'/input.js']->deps[]='ui/'.$dep.'/input.js';
				if($f=\cp::get_file_path('ui/'.$dep.'/inputInit.php')){include $f;}
			}
		}
		if($f=\cp::get_file_path('ui/'.$ui.'/inputInit.php')){include $f;}
		$id=\cp::get_input_id($path).'--ui';
		
		ob_start();
		?>
		<div id="<?=$id?>" data-ui="<?=$ui?>">
			<script type="text/javascript">
				jQuery(function($){
					window.Catpow.uiProps=window.Catpow.uiProps || {};
					window.Catpow.uiProps['<?=$id?>']=<?=json_encode($prm)?>;
					wp.element.render(
						wp.element.createElement(
							Catpow.<?=$ui?>,
							window.Catpow.uiProps['<?=$id?>']
						),
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