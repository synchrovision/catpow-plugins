<?php
/*
register_rest_route(
	'cp/v1',
	'/editor/embeddables/?',
	[
		'method'=>WP_REST_Server::READABLE,
		'callback'=>function($req){
			$data=[];
			\cp::conf_data_walk(function($data_type,$data_name,$conf_data)use(&$data){
				if($data_type==='nav'){return false;}
				foreach(['','alias_'] as $pref){
					if(empty($conf_data[$pref.'template'])){continue;}
					foreach($conf_data[$pref.'template'] as $template){
						$template_data=explode('-',$template);
						$class_name=cp::get_class_name('template_type',$template_data[0]);
						$embeddables=$class_name::get_embeddables($conf_data);
						foreach($embeddables as $embed_type=>$embeddable){
							foreach($embeddable as $label=>$fname){
								$data[$embed_type][$conf_data['label']]
									[$label.(isset($template_data[1])?'('.$template_data[1].')':'')]
									=$conf_data[$pref.'path'].'/'.$template.'/'.$fname;
							}
						}
					}
				}
			});
			return new WP_REST_Response([
				'data'=>$data
			]);
		}
	]
);
*/
register_rest_route(
	'cp/v1',
	'/(?P<content_path>(?P<data_type>\w+)/(?P<data_name>[\w_]+)/(?P<tmp>(?P<tmp_name>[\w_]+)(\-(?P<tmp_slug>[\w_]+))?)/)(?P<rest_name>[\w_]+)(/(?P<param>.+))?/?',
	[
		'method'=>WP_REST_Server::ALLMETHODS,
		'callback'=>function($req){
			$res_404=new WP_REST_Response(['message'=>__('無効なリクエストです','catpow')],404);
			$conf=$GLOBALS[cp::get_conf_data_name($req['data_type'])][$req['data_name']]?:null;
			if(!isset($conf)){return $res_404;}

			$query_class=cp::get_class_name('query',$req['data_type']);
			if(!in_array($req['tmp'],$conf[$query_class::$is_meta?'alias_template':'template'])){return $res_404;}

			$tmp_class=cp::get_class_name('template_type',$req['tmp_name']);
			$rest_routes=$tmp_class::get_rest_routes($conf);
			if(empty($f=$rest_routes[$req['rest_name']])){return $res_404;}

			try{
				$res=new WP_REST_Response([],200);
				if(is_callable($f)){$f($req,$res);}
				elseif(cp::get_template_part($req['content_path'].$f,['req'=>$req,'res'=>$res])===false){return $res_404;}
			}
			catch(Exception $e){
				return new WP_REST_Response(['message'=>$e->getMessage()],500);
			}
			return $res;
		}
	]
);