<?php
namespace Catpow;

class template_creator{
	use traits\singleton;
	public $template_dirs=array(),$_log=array();
	
	static public function init(){
		global $cptc;
		$cptc=new self();
		$cptc->template_dirs[]='.';
		CP::conf_data_walk(function($data_type,$data_name,$conf_data)use($cptc){
			foreach(['','alias_'] as $pref){
				if(empty($conf_data[$pref.'template']) or empty($conf_data[$pref.'path'])){continue;}
				$path=$conf_data[$pref.'path'];
				foreach($conf_data[$pref.'template'] as $template){
					$cptc->template_dirs[]=$path.'/'.$template;
				}
			}
		});
	}
	
	
	public function log(){
		$count_created=0;
		$count_error=0;
		foreach($this->_log as $log){
			if(substr($log,0,7)=='create:'){$count_created++;}
			elseif(substr($log,0,6)=='error:'){$count_error++;}
		}
		printf('%d files created<br/>'.chr(10),$count_created);
		if($count_error){printf('%d files failed<br/>'.chr(10),$count_error);}
		echo(implode('<br/>'.chr(10),$this->_log));
	}
	
	public function render_files($template_dir){
		if($template_dir=='.'){
			$class_name=CP::get_class_name('template_type','primary');
			$conf_data=null;
		}
		else{
			$path_data=CP::parse_content_path($template_dir);
			$class_name=CP::get_class_name('template_type',$path_data['tmp_name']);
			$conf_data=CP::get_conf_data($path_data);
		}
		foreach($class_name::get_template_files($conf_data) as $file=>$code_data){
			$path=$template_dir.'/'.$file;
			if(file_exists($f=STYLESHEETPATH.'/'.$path)){continue;}
			$this->_create_folder_of_file($f);
			$path_data=CP::parse_content_file_path($path);
			$class_name=CP::get_class_name('template_item',$path_data['file_type']);
			try{
				if(is_array($code_data)){
					ob_start();
					$class_name::render($path_data,$conf_data,$code_data);
					if($contents=ob_get_clean()){
						file_put_contents($f,$contents);
						$this->_log[]='create:'.$path;
					}
				}
				else{
					if($code_data==='default'){
						if($default_file=CP::get_file_path(
							'[data_type]/[data_name]/'.$path_data['tmp_name'].'/'.basename($path),4
						)){
							$contents=file_get_contents($default_file);
							$contents=self::do_template_code($contents,$path_data,$conf_data);
							file_put_contents($f,$contents);
							$this->_log[]='create:'.$path;
						}
					}
				}
			}
			catch(Exception $e){
				$this->_log[]='error:'.$e->getMessage();
			}
		}
	}
	public static function do_template_code($contents,$path_data,$conf_data){
		$contents=preg_replace_callback('|\t*<\!\-\-meta(:[\!:\w]+)?\-\->\n(.+?)\t*<\!\-\-/meta\-\->\n|s',function($matches)use($conf_data){
			$rtn='';
			$filters=[];
			if($matches[1]){
				foreach(explode(':',substr($matches[1],1)) as $key){
					if($key[0]==='!'){
						$filters[substr($key,1)]=false;
					}
					else{
						$filters[$key]=true;
					}
				}
			}
			foreach($conf_data['meta'] as $name=>$conf){
				$class_name=\cp::get_class_name('meta',$conf['type']);
				if(!class_exists($class_name)){continue;}
				foreach($filters as $key=>$flag){
					if($class_name::$$key!=$flag){continue 2;}
				}
				$str=$matches[2];
				$str=str_replace('<!--name-->',$name,$str);
				$str=str_replace('<!--label-->',$conf['label'],$str);
				$rtn.=$str;
			}
			return $rtn;
		},$contents);
		$contents=str_replace('<!--data_type-->',$path_data['data_type'],$contents);
		$contents=str_replace('<!--data_name-->',$path_data['data_name'],$contents);
		$contents=str_replace('<!--label-->',$conf_data['label'],$contents);
		return $contents;
	}
	public function create(){
		foreach($this->template_dirs as $template_dir){
			if(!file_exists(STYLESHEETPATH.'/'.$template_dir) or $template_dir=='.'){
				$this->render_files($template_dir);
			}
		}
	}
	private function _create_folder_of_file($f){
		$dir=dirname($f);
		if(!is_dir(dirname($dir)))$this->_create_folder_of_file($dir);
		if(!is_dir($dir))mkdir($dir);
	}
	
}

?>