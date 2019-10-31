<?php
/*
add_filter('get_terms_orderby',function($orderby){
	global $wpdb;
	return "{$wpdb->term_relationships}.term_order ASC,{$orderby}";
});


add_action('admin_init',function(){
	global $pagenow;
	if($pagenow=='edit-tags.php' and is_user_logged_in()){
		wp_enqueue_script('jquery-ui');
		wp_enqueue_script('jquery-ui-sortable');
		wp_enqueue_script('cp_term_sort_script');	
	}
});

add_action('wp_ajax_cp_term_sort',function(){
	check_admin_referer('bulk-terms');
	global $wpdb;
	$ids=explode(',',$_REQUEST['sort_data']);
	$orders=[];
	$tgt_orders=[];
	$taxonomy=get_post_type(reset($ids));
	$all_ids=$wpdb->get_col("SELECT term_id FROM {$wpdb->term_taxonomy} WHERE taxonomy = '{$taxonomy}' ORDER BY term_order ASC");
	foreach($all_ids as $i => $id){$orders[$id]=$i+1;}
	foreach($ids as $id){$tgt_orders[]=$orders[$id];}
	sort($tgt_orders);
	foreach($ids as $i=>$id){$orders[$id]=$tgt_orders[$i];}
	$sql="UPDATE {$wpdb->posts} SET menu_order = CASE ID";
	foreach($orders as $id=>$order){$sql.=" WHEN {$id} THEN {$order}";}
	$sql.=" END WHERE post_type = '{$post_type}'";
	$wpdb->get_results($sql);
	printf('%s(%s);',$_REQUEST['callback'],json_encode($orders));
	die();
});
*/