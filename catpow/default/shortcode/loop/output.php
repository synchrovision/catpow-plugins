<?php
namespace Catpow;
$prm=shortcode_atts(array(0=>false),$atts);

if(cp::$content){
	if(empty($content)){
		loop($prm[0],$atts);
	}
	else{
		foreach(loop($prm[0],$atts) as $obj){
			echo do_shortcode($content);
		}
	}
}