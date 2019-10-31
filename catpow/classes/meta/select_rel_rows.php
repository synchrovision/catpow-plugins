<?php
namespace Catpow\meta;

class select_rel_rows extends meta{
    public static
        $value_type='NUMERIC',
        $data_type='bigint(20)';
    
    public static function output($meta,$prm){
        $val=$meta->value;
        if(empty($val)){return false;}
		global $cpdb,$cpdb_datas;
        
        $alias_name=\cpdb::get_alias_name($meta->conf['table']);
        
        $database_meta=$cpdb_datas[$alias_name];
        if(empty($prm)){
            if(isset($meta->conf['key'])){$key=$meta->conf['key'];}
            else{$key=key($database_meta['meta']);}
        }
        else{$key=$prm;}
        
        $key_meta=$database_meta['meta'][$key];
        
        $row=reset($cpdb->select($table,['meta_id'=>$val],false));
        return \cp::get_output($key_meta,$row[$key])[0];
    }
	public static function input($meta,$prm){
        $sels=self::get_selections($meta);
        return select::get_input($meta->the_data_path,$meta->conf,$sels,$meta->value);
	}
    
    
    public static function get_selections($meta){
        global $cpdb;
		if(empty($meta->conf['table'])){return [];}
        $where=is_callable($meta->conf['value'])?$meta->conf['value']($meta):$meta->conf['value'];
        if(is_object($where) and is_a($where,\cp::get_class_name('query','cpdb'))){$where=$where->where;}
        $table=$meta->conf['table'];
        if(is_string($table)){$table=$cpdb->structure[$table]['path'];}
        if(isset($meta->conf['addition'])){
            if(is_string($meta->conf['addition'])){$rtn[$meta->conf['addition']]=0;}
            else{$rtn=$meta->conf['addition'];}
        }
        $conf_data_name=\cp::get_conf_data_name($table[0]);
        global $$conf_data_name;
        $database_meta=$$conf_data_name[$table[1]]['meta'][$table[2]];
        if(isset($meta->conf['sortby'])){
            $sortby=$meta->conf['sortby'];
            $sortby_meta=$database_meta['meta'][$sortby];
        }
        if(isset($meta->conf['key'])){$key=$meta->conf['key'];}
        else{$key=key($database_meta['meta']);}
        $key_meta=$database_meta['meta'][$key];

        $rows=$cpdb->select($table,$where,false);
        if(isset($sortby)){
            foreach($rows as $i=>$row){
                $rtn[cp_get_cft_output($sortby_meta,$row[$sortby])[0]]
                    [cp_get_cft_output($key_meta,$row[$key])[0]]=$row['meta_id'];
            }
        }
        else{foreach($rows as $row){$rtn[cp_get_cft_output($key_meta,$row[$key])[0]]=$row['meta_id'];}}
        if(isset($meta->conf['addition'])){
            if(is_array($meta->conf['addition'])){$rtn=array_merge($rtn,$meta->conf['addition']);}
            else{$rtn[$meta->conf['addition']]=0;}
        }
        return $rtn;
    }

}
?>