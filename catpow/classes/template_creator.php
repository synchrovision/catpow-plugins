<?php
namespace Catpow;

class template_creator{
    use traits\singleton;
	public $template_dirs=array(),$_log=array();
	
    static public function init(){
        global $cptc,$use_functions;
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
                            copy($default_file,$f);
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