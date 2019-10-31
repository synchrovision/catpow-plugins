<?php
$form=cp::$content->form($attr['content_path']);
if(!empty($attr['inputs'])){
	if($attr['inputs'][0]==='{'){
		$inputs=json_decode($attr['inputs'],1)?:null;
	}
	else{
		$inputs=wp_parse_args($attr['inputs']);
	}
    $data_path=$form->the_data_path;
    foreach($inputs as $key=>$val){
        if(strpos($key,'/')){$form->inputs->set($data_path.'/'.dirname($key),$val,basename($key));}
        else{$form->inputs->set($data_path.'/'.$key,$val);}
    }
}
$form->render(null,['content'=>$content,'post_data_path'=>$attr['post_data_path']??false]);
