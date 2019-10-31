<?php
$conf_data=array_merge([
	'meta'=>[],
	'template'=>['event','test'],
],$conf_data);

$conf_data['meta']=array_merge([
	'apply_start'=>['type'=>'date','label'=>'受付開始'],
	'apply_end'=>['type'=>'date','label'=>'受付締切'],
	'event_date'=>['type'=>'date','label'=>'開催日'],
	'__view'=>['type'=>'radio','label'=>'表示','value'=>['カレンダー'=>'calendar','リスト'=>'list']]
],$conf_data['meta']);