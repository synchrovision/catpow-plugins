<?php

/*plugins_loaded*/
add_action('plugins_loaded',function(){
    global $use_functions;
    cp::$extensions=apply_filters('catpow_extensions',[]);
    cp::$data_types=apply_filters('catpow_data_types',['post','page','nav','term','comment','user','site','view','cpdb']);
    spl_autoload_register(function($class){
        if(substr($class,0,7)==='Catpow\\'){
			$class=str_replace('\\','/',substr($class,7));
			if(cp::include_plugin_file('classes/'.$class)){return true;}
			if(cp::include_template_file('classes/'.$class)){return true;}
			$class_path_data=explode('/',$class);
			$func=array_shift($class_path_data);
			if(in_array($func,$GLOBALS['use_functions'])){
				if(cp::include_plugin_file('functions/'.$func.'/classes/'.implode('/',$class_path_data))){return true;}
			}
		}
		else{
			$class=str_replace('\\','/',$class);
			if(cp::include_plugin_file('lib/'.$class)){return true;}
		}
    });
    do_action('cp_init');
	

	$use_functions=array_merge(['catpow','config'],(array)\cp::get_meta('catpow','config',1,'use_functions'));
    foreach($use_functions as $n){
        cp::include_plugin_files('functions/'.$n.'/functions');
        cp::include_template_files('functions/'.$n.'/functions');
    }
	session_start();
	if($mo_file=cp::get_file_path('languages/catpow-'.get_locale().'.mo')){load_textdomain('catpow',$mo_file);}
	if($mo_file=cp::get_file_path('languages/'.get_locale().'.mo',2)){load_textdomain('theme',$mo_file);}
	do_action('cp_setup');
});

add_action('cp_init',function(){
    cp::include_plugin_files('action/cp_init');
},10,1);

add_action('cp_setup',function(){
    cp::include_plugin_files('action/cp_setup');
},20);
add_action('parse_request',function($wp){
	cp::include_plugin_files('action/parse_request',compact('wp'));
});

/*init*/
add_action('init',function(){
    cp::include_plugin_files('action/init');
});

/*ログイン画面アクション*/
add_action('login_init',function(){
    cp::include_plugin_files('action/login_init');
});
add_action('login_form',function(){
    cp::include_plugin_files('action/login_form');
});
add_action('register_form',function(){
    cp::include_plugin_files('action/register_form');
});

/*APIアクション*/
add_action('rest_api_init',function($wp_rest_server){
    cp::include_plugin_files('action/rest_api_init');
});


/*管理画面アクション*/
add_action('admin_init',function(){
    cp::include_plugin_files('action/admin_init');
});
add_action('admin_head',function(){
    cp::include_plugin_files('action/admin_head');
});
add_action('admin_menu',function(){
    cp::include_plugin_files('action/admin_menu');
});

/*ページ出力時アクション*/
add_action('wp',function(){
    cp::include_plugin_files('action/wp');
});
add_action('template_redirect',function(){
    cp::include_plugin_files('action/template_redirect');
});

/*サイト設定時アクション*/
add_action('after_switch_theme',function(){
    cp::include_plugin_files('action/after_switch_theme');
});
add_action('wpmu_new_blog',function($blog_id, $user_id, $domain, $path, $site_id, $meta){
    cp::include_plugin_files('action/wpmu_new_blog',compact(['blog_id','user_id','domain','path','site_id','meta']));
},10,6);
add_action('delete_blog',function($blog_id, $drop){
    cp::include_plugin_files('action/delete_blog',compact(['blog_id','drop']));
},10,2);


/*cronアクション*/
add_action('cp_cron_hourly',function(){
	cp::include_plugin_files('action/cron_hourly');
});
add_action('cp_cron_daily',function(){
	cp::include_plugin_files('action/cron_daily');
});

?>