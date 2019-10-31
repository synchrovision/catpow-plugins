<?php
/*cron*/
add_action('cp_cron_hourly',function(){
	if($cron_file=\cp::get_file_path('cron_hourly.php'))include($cron_file);
});
add_action('cp_cron_daily',function(){
	if($cron_file=\cp::get_file_path('cron_daily.php'))include($cron_file);
});

 