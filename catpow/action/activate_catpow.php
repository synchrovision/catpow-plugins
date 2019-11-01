<?php
/*cron*/
if(!wp_next_scheduled('cp_cron_hourly')){
	wp_schedule_event(ceil(time()/3600)*3600,'hourly','cp_cron_hourly');
}
if(!wp_next_scheduled('cp_cron_daily')){
	wp_schedule_event(strtotime(date('Y-m-d')),'daily','cp_cron_daily');
}

/*config files setup*/
include(__DIR__.'/../param/gen.php');
	
/*DB setup*/
global $wpdb;
require_once( ABSPATH.'wp-admin/includes/upgrade.php' );
foreach(array('site') as $i=>$meta_type){
	$sql=sprintf('
		CREATE TABLE IF NOT EXISTS %2$s%1$smeta (
		meta_id bigint(20) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		%1$s_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
		meta_key varchar(255), 
		meta_value longtext,
		UNIQUE KEY meta_id (meta_id)
		) %3$s;
	',$meta_type,$wpdb->base_prefix,$wpdb->get_charset_collate());
	dbDelta( $sql );
}
foreach(array('term','view') as $i=>$meta_type){
	$sql=sprintf('
		CREATE TABLE IF NOT EXISTS %2$s%1$smeta (
		meta_id bigint(20) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		%1$s_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
		meta_key varchar(255), 
		meta_value longtext,
		UNIQUE KEY meta_id (meta_id)
		) %3$s;
	',$meta_type,$wpdb->prefix,$wpdb->get_charset_collate());
	dbDelta( $sql );
}

