<?php
namespace Catpow\content;

/**
* renderメソッドを上書き
*/
class form extends content{
	use formTrait;
	
    public function render($slug=false,$vars=false){
		return \LiteSpeed_Cache_API::esi_url('render_cp_form','catpow-litespeed',['form'=>$this,'slug'=>$slug,'vars'=>$vars]);
    }
}

?>