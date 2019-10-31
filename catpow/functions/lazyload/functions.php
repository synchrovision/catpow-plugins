<?php
add_filter('the_content',function($content){
	return str_replace(' src=',' data-src=',$content);
},100);