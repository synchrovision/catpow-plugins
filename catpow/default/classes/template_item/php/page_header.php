<?php
namespace Catpow\template_item\php;
/**
* ページヘッダー
*/

class page_header extends \Catpow\template_item\php{
    public static function get_code_data($path_data,$conf_data,$param){
		$rtn=[''];
		if($conf_data['path']==='page/home'){
			return false;
		}
		else{
			if($conf_data['path']==='post/page'){
				$rtn['cond_start']='<?php if(!is_front_page()): ?>';
			}
            $rtn['title']=['div.title',['div.text',['h1','@page_title',['small','@page_slug']]]];
			if(isset($conf_data['meta']['title_image'])){
				$rtn['title'][]=['div.image',"<?php output('title_image'); ?>"];
			}
			elseif(isset($conf_data['meta']['image'])){
				$rtn['title'][]=['div.image',"<?php output('image'); ?>"];
			}
			else{
				$rtn['title'][]=['div.image',['img[src="<?=header_image();?>"]']];
			}
			$rtn[]='@menu page_header';
            $rtn[]='@breadcrumb';
			if($conf_data['path']==='post/page'){
				$rtn['cond_end']='<?php endif; ?>';
			}
        }
		return $rtn;
    }
}

?>