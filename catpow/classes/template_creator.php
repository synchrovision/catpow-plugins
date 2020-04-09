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
				ob_start();
				self::render_code_data($code_data,$path_data,$conf_data);
				if($contents=ob_get_clean()){
					file_put_contents($f,$contents);
					$this->_log[]='create:'.$path;
				}
			}
			catch(Exception $e){
				$this->_log[]='error:'.$e->getMessage();
			}
		}
	}
	public static function render_code_data($code_data,$path_data,$conf_data){
		$class_name=CP::get_class_name('template_item',$path_data['file_type']);
		if(is_array($code_data)){
			$class_name::render($path_data,$conf_data,$code_data);
		}
		else{
			if($code_data==='default'){
				$file_name=$path_data['file_name'];
				if(isset($path_data['file_slug'])){$file_name.='-'.$path_data['file_slug'];}
				$f=\cp::get_file_path('config/template/'.$path_data['tmp_name'].'/'.$file_name.'.php',034);
			}
			else{
				$f=\cp::get_file_path('config/template/'.$code_data.'.php',034);
			}
			if(empty($f)){return false;}
			echo \Catpow\template_creator::do_template_code(file_get_contents($f),$path_data,$conf_data);
		}
		return true;
	}
	public static function do_template_code($contents,$path_data,$conf_data){
		$class_name=CP::get_class_name('template_item',$path_data['file_type']);
		$contents=preg_replace_callback(self::get_template_code_regex('meta'),function($matches)use($conf_data){
			$rtn='';
			$filters=self::parse_filter_str($matches['filter']);
			$cond_datas=self::get_cond_datas($matches['body']);
			foreach($conf_data['meta'] as $name=>$conf){
				$class_name=\cp::get_class_name('meta',$conf['type']);
				if(!class_exists($class_name)){continue;}
				foreach($filters as $key=>$flag){
					if($class_name::$$key!=$flag){continue 2;}
				}
				if(empty($cond_datas)){
					$str=$matches['body'];
				}
				else{
					foreach($cond_datas['items'] as $cond_index=>$cond_data){
						foreach($cond_data['filters'] as $key=>$flag){
							if($class_name::$$key!=$flag){
								$str=str_replace('<<'.$cond_index.'>>',$cond_data['else'],$cond_datas['body']);
								continue 2;
							}
						}
						$str=str_replace('<<'.$cond_index.'>>',$cond_data['body'],$cond_datas['body']);
					}
				}
				if(strpos($str,'<!--children')!==false){
					$str=preg_replace_callback(self::get_template_code_regex('children'),function($matches)use($conf){
						if(empty($conf['meta'])){return '';}
						$rtn='';
						$filters=self::parse_filter_str($matches['filter']);
						$cond_datas=self::get_cond_datas($matches['body']);
						foreach($conf['meta'] as $name=>$child_conf){
							$class_name=\cp::get_class_name('meta',$child_conf['type']);
							if(!class_exists($class_name)){continue;}
							foreach($filters as $key=>$flag){
								if($class_name::$$key!=$flag){continue 2;}
							}
							if(empty($cond_datas)){
								$str=$matches['body'];
							}
							else{
								foreach($cond_datas['items'] as $cond_index=>$cond_data){
									foreach($cond_data['filters'] as $key=>$flag){
										if($class_name::$$key!=$flag){
											$str=str_replace('<<'.$cond_index.'>>',$cond_data['else'],$cond_datas['body']);
											continue 2;
										}
									}
									$str=str_replace('<<'.$cond_index.'>>',$cond_data['body'],$cond_datas['body']);
								}
							}
							$str=str_replace('<!--name-->',$name,$str);
							$str=str_replace('<!--label-->',$child_conf['label'],$str);
							$rtn.=$str;
						}
						return $rtn;
					},$str);
				}
				$str=str_replace('<!--name-->',$name,$str);
				$str=str_replace('<!--label-->',$conf['label'],$str);
				$rtn.=$str;
			}
			return $rtn;
		},$contents);
		$contents=str_replace('<!--data_type-->',$path_data['data_type'],$contents);
		$contents=str_replace('<!--data_name-->',$path_data['data_name'],$contents);
		$contents=str_replace('<!--label-->',$conf_data['label'],$contents);
		$contents=preg_replace_callback('|(\t*)<\!\-\-@(\w+)( .+?)\-\->|',function($matches)use($path_data,$conf_data){
			$class_name=\cp::get_class_name('template_item',$path_data['file_type'],$matches[2]);
			$code_data=$class_name::get_code_data($path_data,$conf_data,explode(' ',substr($matches[3],1)));
			if(is_array($val)){
				$class_name=\cp::get_class_name('template_item',$path_data['file_type']);
				ob_start();
				$class_name::render($path_data,$conf_data,$code_data,strlen($matches[1]));
				return ob_get_clean();
			}else{
				return $matches[1].$val;
			}
		},$contents);
		return $contents;
	}
	public static function get_template_code_regex($name,$sep=null){
		$rtn='|(?P<indent>\t*)<\!\-\-'.$name.'(?P<filter>:[\!:\w]+)?\-\->\n(?P<body>.+?\n)';
		if(isset($sep)){$rtn.='(\1<\!\-\-'.$sep.'\-\->\n(?P<'.$sep.'>.+?\n))?';}
		$rtn.='\1<\!\-\-/'.$name.'\-\->\n|s';
		return $rtn;
	}
	public static function parse_filter_str($filter_str){
		if(empty($filter_str)){return [];}
		$filter=[];
		foreach(explode(':',substr($filter_str,1)) as $key){
			if($key[0]==='!'){
				$filter[substr($key,1)]=false;
			}
			else{
				$filter[$key]=true;
			}
		}
		return $filter;
	}
	public static function get_cond_datas($body){
		if(strpos($body,'<!--if:')===false){return false;}
		$cond_datas=['items'=>[]];
		$cond_datas['body']=preg_replace_callback(self::get_template_code_regex('if','else'),function($matches)use(&$cond_datas){
			$conds=self::parse_filter_str($matches['filter']);
			$cond_index='cond:'.count($cond_datas);
			$cond_datas['items'][$cond_index]=[
				'index'=>$cond_index,
				'filters'=>self::parse_filter_str($matches['filter']),
				'body'=>$matches['body'],
				'else'=>$matches['else']??''
			];
			return '<<'.$cond_index.'>>';
		},$body);
		return $cond_datas;
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