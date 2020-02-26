<?php
namespace Catpow;
$prm=shortcode_atts([0=>'name'],$atts);
switch($prm[0]){
	case 'id':the_ID();break;
	case 'title':the_title();break;
	case 'content':the_content();break;
	case 'date':the_date();break;
	case 'author':the_author();break;
	case 'url':the_permalink();break;
	default:
		echo the_permalink();break;
}