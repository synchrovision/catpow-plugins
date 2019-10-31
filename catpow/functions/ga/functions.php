<?php
add_action('cp_setup',function(){
	if($cp_ga_code=get_option('cp_ga_code')){
		$cp_ga_code=reset($cp_ga_code);
		add_action('wp_footer',function()use($cp_ga_code){
			?>
			<script>
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

				ga('create', '<?=$cp_ga_code?>', 'auto');
				<?php foreach(apply_filters('cpga_dimensions',[]) as $key=>$val):?>
				ga('set', '<?=$key?>', '<?=$val?>');
				<?php endforeach; ?>
				ga('send', 'pageview');
			</script>
			<?php
		});
	}
});

function cpga_send_event($cat,$action,$label=false,$value=false){
	$event=['eventCategory'=>$cat,'eventAction'=>$action];
	if($label!==false)$event['eventLabel']=$label;
	if($value!==false)$event['eventValue']=$value;
	printf("<script>ga('send','event',%s);</script>",json_encode($event));
}
