<?php
include(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))).'/wp-load.php');
delete_transient('cpfb_access_token');
wp_logout();
?>
<script type="text/javascript">
	window.close();
</script>