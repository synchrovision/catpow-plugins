<?php
header('content-type: image/gif;');

include __DIR__.'/classes/autoload.php';

if(preg_match(
	'/(\d+)\/([^\/]+)\/([^\/]+\/[^\/]+\/[^\/]+)\/([0-9a-f]{16})\-([0-9a-f]{16})/',
	$_GET['path'],
	$matches
)){
	list(,$blog_id,$data_type,$path,$token,$token_key)=$matches;
	$f=dirname(__DIR__,3).'/task/'.$blog_id.'/'.$data_type.'/'.$path.'/'.$token.'.php';
	if(!file_exists($f)){die();}
	include $f;
	if(empty($param['beacon'][$_GET['key']])){die();}
	$param['flag'][$param['beacon'][$_GET['key']]]=true;
	unset($param['beacon'][$_GET['key']]);
	file_put_contents($f,"<?php\n\$param=".var_export($param,true).';');
};
