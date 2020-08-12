<?php
/*cron*/
if(!wp_next_scheduled('cp_cron_every_minutes')){
	wp_schedule_event(ceil(time()/60)*60,'every_minutes','cp_cron_every_minutes');
}
if(!wp_next_scheduled('cp_cron_hourly')){
	wp_schedule_event(ceil(time()/3600)*3600,'hourly','cp_cron_hourly');
}
if(!wp_next_scheduled('cp_cron_daily')){
	wp_schedule_event(strtotime(date('Y-m-d')),'daily','cp_cron_daily');
}