<?php
namespace Catpow;
$prm=shortcode_atts([0=>'name']);
switch($prm[0]){
	case 'name':echo get_user()->display_name;break;
	case 'login':echo get_user()->user_login;break;
	case 'email':echo get_user()->user_email;break;
	case 'role':echo $GLOBALS['user_datas'][reset(get_user()->roles)]['label'];break;
}