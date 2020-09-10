<?php
namespace Catpow\meta;

class media extends meta{
	public static
		$value_type='NUMERIC',
		$data_type='bigint(20)',
		$can_search=false;
	
	public static function output($meta,$prm){
		$val=$meta->value;
		if($prm=='url'){return wp_get_attachment_url($val);}
		if(empty($post=get_post($val))){return '';}
		if($prm=='type'){return $post->post_mime_type;}
		if($prm==='alt'){return $post->_wp_attachment_image_alt;}
		$prm=(array)$prm;
		switch(substr($post->post_mime_type,0,5)){
			case 'image':
				return wp_get_attachment_image($val,has_image_size($prm[0])?$prm[0]:($prm['size']??'full'));
			case 'video':
				return sprintf(
					'<video src="%s"%s></video>',
					wp_get_attachment_url($val),
					static::get_player_attr(array_merge($meta->conf,$prm))
				);
			case 'audio':
				return sprintf(
					'<audio src="%s"%s></audio>',
					wp_get_attachment_url($val),
					static::get_player_attr(array_merge($meta->conf,$prm))
				);
		}
	}
	public static function input($meta,$prm){
		return self::get_input($meta->the_data_path,$meta->conf,$meta->value);
	}
	
	public static function get_input($path,$conf,$val){
		if(isset($conf['dummy'])){$dummy=get_template_directory_uri('/images/'.$conf['dummy']);}
		else{$dummy=\cp::get_file_url('images/dummy.jpg');}
		
		wp_enqueue_media();
		wp_enqueue_script('cp_media_upload');
		
		if(empty($val)){
			return sprintf(
				'<img class="ajax_upload_media image" src="%s"/><input type="hidden" name="%s"/>',
				$dummy,\cp::get_input_name($path)
			);
		}
		$post=get_post($val);
		if(empty($post)){
			return sprintf(
				'<img class="ajax_upload_media image" src="%s"/><input type="hidden" name="%s" value="%s"/>',
				$dummy,\cp::get_input_name($path),$val
			);
		}
		$src=wp_get_attachment_url($val);
		switch(substr($post->post_mime_type,0,5)){
			case 'image':
				return sprintf(
					'<img class="ajax_upload_media image" src="%s"/><input type="hidden" name="%s" value="%s"/>',
					$src?$src:$dummy,\cp::get_input_name($path),$val
				);
			case 'video':
				return sprintf(
					'<video class="ajax_upload_media video" src="%s"></video><input type="hidden" name="%s" value="%s"/>',
					$src,\cp::get_input_name($path),$val
				);
			case 'audio':
				return sprintf(
					'<audio class="ajax_upload_media audio" src="%s"></audio><input type="hidden" name="%s" value="%s"/>',
					$src,\cp::get_input_name($path),$val
				);
			default:
				return sprintf(
					'<img class="ajax_upload_media image" src="%s"/><input type="hidden" name="%s" value="%s"/>',
					$dummy,\cp::get_input_name($path),$val
				);
				
		}
	}
	public static function get_player_attr($prm){
		return
		(isset($prm['controls']) && empty($prm['controls'])?'':' controls').
		(empty($prm['autoplay'])?'':' autoplay').
		(empty($prm['muted'])?'':' muted').
		(empty($prm['playsinline'])?'':' playsinline').
		(empty($prm['preload'])?'':' preload').
		(empty($prm['loop'])?'':' loop');
	}
}

?>