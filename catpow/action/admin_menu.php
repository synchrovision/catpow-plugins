<?php 
namespace Catpow;
add_menu_page('CATPOW','CATPOW','edit_themes','catpow-main',function(){
    cp::enqueue_style('site-content','content.css');
    this()->render();
});
add_submenu_page('catpow-main','リファレンス','リファレンス','edit_themes','catpow-refelence',function(){
    cp::enqueue_style('site-content','content.css');
    this()->render();
});



function add_menus($data_type,$data_name,$menus){
	foreach($menus as $slug=>$menu){
		switch($slug){
			case 'top':
				foreach($menu as $label=>$link){
					$link=get_menu_link($link);
					if(is_array($link)){
						add_menu_page($label,$label,'publish_posts',key($link),reset($link));
					}
					else{
						add_menu_page($label,$label,'publish_posts',$link);
					}
				}
				break;
			case 'sub':$slug=$data_type.'/'.$data_name;
			default;
				$parent=get_menu_link($slug);
				if(is_array($parent)){$parent=key($parent);}
				foreach($menu as $label=>$link){
					$link=get_menu_link($link);
					if(is_array($link)){
						add_submenu_page($parent,$label,$label,'publish_posts',key($link),reset($link));
					}
					else{
						add_submenu_page($parent,$label,$label,'publish_posts',$link);
					}
				}
				break;
		}
	}
}
/**
* add_menu_page　add_submenu_pageの引数として用いる値を取得する
* @param string $data_type 
* @param string $data_name 
* @param string $slug 規定値またはcontent_path
* @return string|array リンクの識別子、または[識別子=>コールバック]のペアの配列
*/
function get_menu_link($slug){
	static $hooks;
	global $post_types;
	if($slug==='post' || $slug==='post/post'){return 'edit.php';}
	if($slug==='attachment' || $slug==='post/attachment'){return 'upload.php';}
	if($slug==='user' || substr($slug,0,5)==='user/'){return 'users.php';}
	if(isset($post_types[$slug])){return 'edit.php?post_type='.$slug;}
	if($path_data=cp::parse_content_path($slug)){
		switch($path_data['data_type']){
			case 'post':return 'edit.php?post_type='.$path_data['data_name'];
			case 'user':return 'users.php';
			case 'cpdb':
				$key=str_replace('/','-',$slug);
				if(!isset($hooks[$key])){
					$hooks[$key]=function()use($slug){
						echo('<div id="cpcf_custom_box"><div class="inside">');
						§form($slug.'/manage/admin.php');
						echo('</div></div>');
						cp::enqueue_style('content.css');
						cp::enqueue_script($slug.'/script.js');
						cp::enqueue_style($slug.'/style.css');
					};
				}
				return [$key=>$hooks[$key]];
		}
	}
}
cp::conf_data_walk(function($data_type,$data_name,&$conf_data){
	if(isset($conf_data['article_type'])){
		$class_name=cp::get_class_name('article_type',$conf_data['article_type']);
		add_menus($data_type,$data_name,$class_name::get_menus($conf_data));
	}
	if($templates=$conf_data[($data_type=='cpdb'?'alias_':'').'template']??null){
		foreach($templates as $template){
			$class_name=cp::get_class_name('template_type',explode('-',$template)[0]);
			add_menus($data_type,$data_name,$class_name::get_menus($conf_data));
		}
	}
});

if(isset($GLOBALS['post_types']['wp_block'])){
	$conf=$GLOBALS['post_types']['wp_block'];
	$label=$conf['label']??_('再利用可能ブロック','catpow');
	if($conf['show_in_menu']??true){
		add_menu_page($label,$label,$conf['capability']??'publish_posts','edit.php?post_type=wp_block');
	}
}

