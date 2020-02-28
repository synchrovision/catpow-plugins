<?php
namespace Catpow\amazonpay;

class Agent{
	public $client,$config;
	
	public function __construct(){
		$conf=get_option('cp_amazonpay_keys')[0];
		
		foreach($conf as $key=>$val){$conf[$key]=reset($val);}
		$conf['sandbox']=$conf['sandbox']!=-1;
		$this->config=array_merge([
			'type'=>'PwA',
			'region'=>'jp',
			'color'=>'Gold',
			'size'=>'medium',
			'langage'=>'ja-JP'
		],$conf);
		
		$this->client=new \AmazonPay\Client(array_intersect_key($this->config,array_flip([
			'merchant_id','access_key','secret_key','client_id','region','sandbox'
		])));
		wp_localize_script('ui/AmazonPay/input.js','amazonpay_config',array_intersect_key($this->config,array_flip([
			'merchant_id','client_id','color','size'
		])));
	}
	
	public function renderScripts(){
		?>
		<script type="text/javascript">  
			window.onAmazonLoginReady = function() {  
                try {
					amazon.Login.setClientId("<?=$this->config['client_id']?>");  
                    amazon.Login.setUseCookie(true);
                } catch (err) {
                    console.error(err);
                }
			};  
			window.onAmazonPaymentsReady = function() { 
				
			};
		</script>
		<script src='<?=$this->getWidgetsJsURL()?>'></script>  
		<?php
	}
	function getWidgetsJsURL(){
        $sandbox = $this->config['sandbox']?"sandbox/":"";

		switch (strtolower($this->config['region'])) {
			case "us":
				return "https://static-na.payments-amazon.com/OffAmazonPayments/us/" . $sandbox . "js/Widgets.js";
				break;
			case "uk":
				return "https://static-eu.payments-amazon.com/OffAmazonPayments/gbp/" . $sandbox . "lpa/js/Widgets.js";
				break;
			case "jp":
				return "https://static-fe.payments-amazon.com/OffAmazonPayments/jp/" . $sandbox . "lpa/js/Widgets.js";
				break;
			default:
				return "https://static-eu.payments-amazon.com/OffAmazonPayments/eur/" . $sandbox . "lpa/js/Widgets.js";
				break;
		}
	}
}