<?php
if(class_exists('cp')){
	
	/*管理バー*/
	if(!current_user_can('administrator')){show_admin_bar(false);}

	/*カスタマイズ機能*/
	add_theme_support('title-tag');
	add_theme_support('custom-header',['default-image'=>cp::get_file_url('/images/header.jpg'),'height'=>'1080px','width'=>'1920px']);
	add_theme_support('custom-logo',['default-image'=>cp::get_file_url('/images/logo.png')]);
	add_theme_support('custom-background',['default-image'=>cp::get_file_url('/images/bg.png')]);


	/*管理画面アクセス制限*/
	add_action('admin_head',function(){cp::user_cap_barrier('edit_others_posts');});


	/*自動段落タグ無効化*/
	remove_filter('the_content','wpautop');
	remove_filter('the_excerpt','wpautop');


	/*追加スクリプト*/
	add_action('wp_enqueue_scripts',function(){
		wp_enqueue_script('cp_menu');
		wp_enqueue_script('cp_article_nav');
	});
	
	/*カスタムカラー無効*/
	add_theme_support('editor-color-palette');
	add_theme_support('disable-custom-colors');
	
	/*カスタムフォントサイズ無効*/
	add_theme_support('editor-font-sizes',[
		['name'=>'大','slug'=>'large','size'=>'1.6rem'],
		['name'=>'中','slug'=>'regular','size'=>'1.3rem'],
		['name'=>'小','slug'=>'small','size'=>'1rem'],
	]);
	add_theme_support('disable-custom-font-sizes');
}