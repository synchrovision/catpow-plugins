<?php
namespace Catpow;
$prm=shortcode_atts([0=>'name'],$atts);
switch($prm[0]){
	case 'id':the_ID();break;
	case 'title':the_title();break;
	case 'content':echo do_blocks($GLOBALS['post']->post_content);break;
	case 'excerpt':the_excerpt();break;
	case 'date':the_date();break;
	case 'author':the_author();break;
	case 'url':the_permalink();break;
	default: echo $GLOBALS['post']->{$prm[0]};
}