<?php
if(!empty($wp->query_vars['cp_callee'])){
	list($function,$action,$param) = explode('/',$wp->query_vars['cp_callee']);
	cp::include_plugin_file('functions/'.$function.'/callee/'.$action,compact('param'));
	die();
}