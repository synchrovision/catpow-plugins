<?php
$form=cp::$content->form(
	$attr['content_path'],
	do_shortcode($attr['data_id']??'')?:null,
	$attr['inputs']??null
);
if(!empty($attr['values'])){
	if($attr['values'][0]==='{'){
		$values=json_decode($attr['values'],1)?:null;
	}
	else{
		$values=wp_parse_args($attr['values']);
	}
	$data_path=$form->the_data_path;
	foreach($values as $key=>$val){
		if(strpos($key,'/')){$form->inputs->set($data_path.'/'.dirname($key),$val,basename($key));}
		else{$form->inputs->set($data_path.'/'.$key,$val);}
	}
}
$form->render(null,['content'=>$content,'post_data_path'=>$attr['post_data_path']??false]);
