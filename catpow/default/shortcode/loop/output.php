<?php
namespace Catpow;
$prm=shortcode_atts(array(0=>false,1=>null),$atts);

if(cp::$content){
	if(empty($content)){
		loop($prm[0],$prm[1]);
	}
	else{
		foreach(loop($prm[0],$prm[1]) as $obj){
			echo do_shortcode($content);
		}
	}
}