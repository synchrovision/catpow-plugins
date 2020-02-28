<?php

add_action('requier_payment',function(){
	$agent=new \Catpow\amazonpay\Agent();
	$agent->renderScripts();
});