<?php
namespace Catpow;
$prm=shortcode_atts([
	0=>'送信',
	1=>false,
	'param'=>null,
	'target'=>null,
	'ignore_message'=>null
],$atts);
if(isset($prm['param'])){$prm['param']=json_decode($prm['param']);}
if(!empty(\cp::$content->form)){
	\cp::$content->form->button($prm[0],$prm[1],$prm['param'],$prm['target'],$prm['ignore_message']);
}
else{
	echo '<a class="button" href="'.$prm[1].'">'.$prm[0].'</a>';
}
