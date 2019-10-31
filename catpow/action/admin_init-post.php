<?php
namespace Catpow;


add_action('admin_bar_menu',function($wp_admin_bar){
	global $wpdb,$post;
	$prev_post_id=$wpdb->get_var("SELECT MAX(ID) FROM $wpdb->posts WHERE post_type = '$post->post_type' AND post_status = 'publish' AND ID < $post->ID");
	$next_post_id=$wpdb->get_var("SELECT MIN(ID) FROM $wpdb->posts WHERE post_type = '$post->post_type' AND post_status = 'publish' AND ID > $post->ID");
	if(isset($prev_post_id)){
		$first_post_id=$wpdb->get_var("SELECT MIN(ID) FROM $wpdb->posts WHERE post_type = '$post->post_type' AND post_status = 'publish'");
		if($first_post_id!==$prev_post_id){
			$wp_admin_bar->add_menu([
				'id'=>'first_post_edit',
				'title'=>'«',
				'href'=>add_query_arg(['post'=>$first_post_id])
			]);
		}
		$wp_admin_bar->add_menu([
			'id'=>'prev_post_edit',
			'title'=>'<',
			'href'=>add_query_arg(['post'=>$prev_post_id])
		]);
	}
	if(isset($next_post_id)){
		$wp_admin_bar->add_menu([
			'id'=>'next_post_edit',
			'title'=>'>',
			'href'=>add_query_arg(['post'=>$next_post_id])
		]);
		$last_post_id=$wpdb->get_var("SELECT MAX(ID) FROM $wpdb->posts WHERE post_type = '$post->post_type' AND post_status = 'publish'");
		if($last_post_id!==$next_post_id){
			$wp_admin_bar->add_menu([
				'id'=>'last_post_edit',
				'title'=>'»',
				'href'=>add_query_arg(['post'=>$last_post_id])
			]);
		}
	}
},100);
add_action('save_post', function($id,$post,$update){do_action('cp_save_post',$id,$post);},10,3);
add_action('attachment_updated',function($id,$post_after,$post_before){do_action('cp_save_post',$id,$post_after);},10,3);
add_action('cp_save_post',function($id,$post){
	if(did_action('cp_save_post')>1){return;}
	$form=CP::get_the_form();
	if(!empty($form)){
		try{
			$form->receive();
			$form->push();
			$form->clear();
		}
		catch(content\form_exception $e){
			if(isset($e->data['message'])){
				echo implode('<br/>',$e->data['message']);
				die();
			}
		}
	}
},10,2);
add_filter('user_can_richedit',function($can_richedit){
	if(isset($GLOBALS['post_types'][get_post_type()]['richedit'])){
		return $GLOBALS['post_types'][get_post_type()]['richedit'];
	}
	return $can_richedit;
});

