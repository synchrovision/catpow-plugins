<?php
$conf_data=array_merge([
	'meta'=>[],
	'template'=>['banner'],
],$conf_data);

$conf_data['meta']=array_merge([
	'banner'=>['type'=>'media','label'=>'バナー'],
	'url'=>['type'=>'text','label'=>'URL']
],$conf_data['meta']);