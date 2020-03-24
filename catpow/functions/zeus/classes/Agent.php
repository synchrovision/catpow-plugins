<?php
namespace Catpow\zeus;

class Agent{
	public $config,$token_key;
	const INSTANCE_NAME='CatpowZeusAgent';
	
	public static function getInstance(){
		if(isset($_SESSION[self::INSTANCE_NAME])){
			return $_SESSION[self::INSTANCE_NAME];
		}
		$_SESSION[self::INSTANCE_NAME]=new self();
		return $_SESSION[self::INSTANCE_NAME];
	}
	
	public function __construct(){
		$this->init();
	}
	public function init(){
		$conf=get_option('cp_Zeus_keys')[0];
		
		foreach($conf as $key=>$val){$conf[$key]=reset($val);}
		$this->config=$conf;
	}
	
	public function renderButton($prm){
		$uiPath='functions/zeus/ui/Zeus';
		if(!wp_script_is($uiPath.'.js')){
			\cp::enqueue_style($uiPath.'.css');
			wp_enqueue_style('ZeusSstyle','https://linkpt.cardservice.co.jp/api/token/1.0/zeus_token.css');
			wp_enqueue_script('ZeusScript','https://linkpt.cardservice.co.jp/api/token/1.0/zeus_token_cvv.js');
			\cp::enqueue_script($uiPath.'.js',['wp-element','babelHelpers','ZeusScript']);
		}
		$id='ZeusButtonContainer';
		
		if(empty($prm['action'])){
			$prm['action']='zeus';
		}
		
		?>
		<div id="<?=$id?>"></div>
		<script type="text/javascript">  
			var zeusTokenIpcode= "<?=$this->config['ipcode']?>";
			jQuery(function($){ 
				wp.element.render(
					wp.element.createElement(
						Catpow.Zeus,
						<?=json_encode($prm)?>
					),
					document.getElementById("<?=$id?>")
				);
			});
		</script>
		<div id="ZeusButtonContainer">
			<link rel="stylesheet" href="s"/>
			<div id="ZeusButton">クレジットカード</div>
			<div id="ZeusWidgetContainer">
				<div id="zeus_token_card_info_area"></div>
				<div id="ZeusCheckoutButton"></div>
			</div>
			<script>
				
				
				jQuery(function($){
					var $zeusButton=$('#ZeusButton');
					var $zeusCheckoutButton=$('#ZeusCheckoutButton');
					var initZeusWidget=function(){
						zeusTokenStart();
					};
					if(window.zeusTokenStart===undefined){
						$.getScript(,initZeusWidget);
					}
					else{
						initZeusWidget();
					}
					$zeusCheckoutButton.on('click',function(){
						zeusToken.getToken(function(zeus_token_response_data){
							if (!zeus_token_response_data['result']){
								alert(zeusToken.getErrorMessage(zeus_token_response_data['error_code']));
							}
							else {
								cp_form_submit($zeusCheckoutButton,'<?=$prm['action']??'zeus'?>',function($item,res){
									console.log(res);
								},{token_key:zeus_token_response_data.token_key});
							}
						});
					});
				});
			</script>
		</div>
		<?php
	}
	public function setToken($token_key){
		$this->token_key=$token_key;
	}
	
	public function authorize($data){
		/*
		money*　決済金額
		send* 'mall'固定
		telno* ユーザーの電話番号
		email* ユーザーのメールアドレス
		sendid フリーパラメータ
		sendpoint フリーパラメータ
		pubsec CGIコールを停止
		printord レスポンスでオーダ番号を取得
		div 支払回数
		*/
		$user=wp_get_current_user();
		return $this->query(array_merge([
			'money'=>0,
			'send'=>'mall',
			'email'=>$user->user_email,
			'telno'=>$user->tel
		],$data));
	}
	
	public function query($data){
		$url='https://linkpt.cardservice.co.jp/cgi-bin/secure.cgi';
		$data=array_merge([
			'clientip'=>$this->config['ipcode'],
			'token_key'=>$this->token_key
		],$data);
		$res=file_get_contents($action_to_url[$action],false,stream_context_create([
			'http'=>[
				'method'=>'POST',
				'header'=> "Content-type: application/x-www-form-urlencoded\r\nContent-Length:".strlen($data)."\r\n",
				'content'=>$data
			]
		]));
		return simplexml_load_string($res);
	}
	
	function __sleep(){
		return ['config','token_key'];
	}
}