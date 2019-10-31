<?php
namespace Catpow\content;

/**
* 別接続からの入力を受け取るためのフォーム
* 入力値やパラーメータをファイルとして保持し
* トークンによってそれを共有する
*/
class task extends form{
	public $token,$token_key,$f,$param;
	
    public function __construct($param){
        parent::__construct($param);
		if(isset($this->token)){
			$this->f=$this->get_dir().$this->token.'.php';
			$this->load();
		}
		else{
			$this->create();
		}
        if(!is_null($this->parent->form)){
			if(isset($this->parent->form->tasks[$this->form_id])){
				$this->parent->form->tasks[$this->form_id]->delete();
			}
			$this->parent->form->tasks[$this->form_id]=$this;
		}
    }
	
	public function get_dir(){
		return WP_CONTENT_DIR.'/task/'.get_current_blog_id().'/'.substr($this->file_path,0,-4).'/';
	}
	public function get_url(){
		$id=$this->get_task_id();
		$url=home_url(substr($id,strpos($id,'/')));
		return $url;
	}
	public function get_task_id(){
		$id=$this->path.'/'.$this->token.'-'.$this->token_key;
		if(!is_null($this->file_slug)){$id.='/'.$this->file_slug;}
		return $id;
	}
	public static function parse_task_id($id){
		if(preg_match('/([\w_\-\/]+)\/([0-9a-f]{16})\-([0-9a-f]{16})(\/(\w+))?\/?/',$id,$matches)){
			$file_path=$matches[1].'/task';
			if(!empty($matches[5])){$file_path.='-'.$matches[5];}
			$file_path.='.php';
			$path_data=\cp::parse_content_file_path($file_path);
			if(empty($path_data)){return false;}
			return [
				'path_data'=>$path_data,
				'token'=>$matches[2],
				'token_key'=>$matches[3],
			];
		}
		return false;
	}
	
	
	public function complete(){
		$this->param['complete']=true;
		$this->save();
		return $this;
	}
	public function is_completed(){
		return !empty($this->param['complete']);
	}
	public function create(){
		$param=$this->param;
		if(!isset($param['expire'])){$param['expire']=strtotime('+ 1 hour');}
		if(!isset($param['limit'])){$param['limit']=1;}
		if(!isset($param['authorized'])){$param['authorized']=[];}
		if(!isset($param['complete'])){$param['complete']=false;}
		if(!isset($param['inputs_data'])){$param['inputs_data']=[];}
		if(!isset($param['key'])){$param['key']=\cp::rand_id(8);}
		$dir=$this->get_dir();
		do{$token=\cp::rand_id(8);$f=$dir.$token.'.php';}
		while(file_exists($f));
		dir_create(dirname($f));
		$str="<?php\n\$param=".var_export($param,true).';';
        file_put_contents($f,$str);
		$this->f=$f;
		$this->token=$token;
		$this->token_key=$param['key'];
		$this->param=$param;
	}
	public function delete(){
		unlink($this->f);
	}
	public function save(){
		$this->param['inputs_data']=$this->inputs->data;
		$str="<?php\n\$param=".var_export($this->param,true).';';
        file_put_contents($this->f,$str);
		return $this;
	}
	public function load(){
		include $this->f;
		if(in_array(\cp::$id,(array)$param['authorized'])){$this->param=$param;return $this;}
		if($this->token_key!==$param['key']){return false;}
		if($param['expire']<time() || $param['limit'] < 1){unlink($this->f);return false;}
		$param['limit']--;
		$param['authorized'][]=\cp::$id;
		$str="<?php\n\$param=".var_export($param,true).';';
		file_put_contents($this->f,$str);
		$this->param=$param;
		$this->inputs->data=$this->param['inputs_data'];
		return $this;
	}
}

?>