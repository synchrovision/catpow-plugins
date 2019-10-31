<?php
namespace Catpow\query;
/**
* cpdbのテーブルごとの情報を格納し操作するためのクラス
*/
class cpdb extends query{
    public static
        $data_type='cpdb',
        $query_class=false,
		$united=true,
		$is_meta=true,
        $search_keys=['join'=>1,'orderby'=>1],
		$q_default=['table'=>false,'where'=>false,'orderby'=>false,'join'=>false,'limit'=>false];
    public $table,$path,$columns,$rows,$where,$orderby,$join,$limit;
    
    public function __construct($q){
        $this->query($q);
    }
    
	public static function get($data_name,$data_id){
        global $cpdb;
		return $cpdb->select($data_name,['meta_id'=>$data_id])[$data_id]??null;
	}
	public static function set($data_name,$data_id,$object_data){
        global $cpdb;
		return $cpdb->update($data_name,[$data_id=>$object_data]);
	}
    public static function insert($object_data){
        global $cpdb;
        return $cpdb->insert($object_data['table'],$object_data);
    }
    public static function update($object_data){
        global $cpdb;
        $cpdb->update($object_data['table'],[$object_data['meta_id']=>$object_data]);
        return $object_data['meta_id'];
    }
	public static function delete($data_name,$data_id){
        global $cpdb;
		return $cpdb->delete($data_name,['meta_id'=>$data_id])[$data_id];
	}
    
	public static function fill_query_vars($q){
		if(isset($q['data_name'])){$q['table']=$q['data_name'];}
		if(isset($q['paged']) && isset($q['limit'])){$q['offset']=$q['limit']*$q['paged'];}
		if(isset($q['meta_query'])){
			foreach($q['meta_query'] as $meta_name=>$meta_query){
				$q['where'][$meta_query['key']][$meta_query['compare']]=$meta_query['value'];
			}
		}
		if(isset($q['include'])){$q['meta_id']=$q['include'];}
		return $q;
	}
    
    public function query($q){
        global $cpdb;
		$q=static::fill_query_vars($q);
        $q=array_merge(self::$q_default,array_intersect_key($q,self::$q_default));
		$this->q=$q;
        extract($q);
        $this->table=\cpdb::get_table_name($table);
        $this->path=$cpdb->structure[$this->table]['path'];
        $this->columns=$cpdb->structure[$this->table]['columns'];
        $this->where=$where;
        $this->orderby=$orderby;
        $this->join=$join;
        $this->limit=$limit;
		if(isset($offset)){$limit=$offset.','.$limit;}
        return $this->rows=$cpdb->select($table,$where,true,'*',$orderby,$join,$limit);
    }
    
    public function is_empty(){
        return empty($this->rows);
    }
    public function count(){
        return count($this->rows);
    }
    public function loop(){
        global $cpdb;
        $table=$this->table;
        $path=$this->path;
        
        $rows=$this->rows;
        $class_name=\cp::get_class_name('data_type','cpdb');
		foreach($rows as $id=>$row){
			yield $id=>new $class_name($table,$row);
		}
    }
    public static function manual_loop($rows){
        $class_name=\cp::get_class_name('data_type','cpdb');
        foreach($rows as $row){
			yield $id=>new $class_name($table,$row);
        }
    }
	
    public function export(){
		$datas=[];
		$conf=\cp::get_conf_data($this->path);
		foreach($this->rows as $row){
			foreach($conf['meta'] as $meta_name=>$meta_conf){
				if(!isset($row[$meta_name])){continue;}
				$meta_class=\cp::get_class_name('meta',$meta_conf['type']);
				if(empty($meta_conf['multiple']) && !$meta_class::$is_bulk_input){$row[$meta_name]=reset($row[$meta_name]);}
			}
			$datas[]=array_merge(['table'=>$this->table],$row);
		}
		return $datas;
	}
    public static function import($datas){
		foreach($datas as $row){
			$conf=$GLOBALS['cpdb_datas'][$row['table']];
			foreach($conf['meta'] as $meta_name=>$meta_conf){
				if(!isset($row[$meta_name])){continue;}
				$meta_class=\cp::get_class_name('meta',$meta_conf['type']);
				if(empty($meta_conf['multiple']) && !$meta_class::$is_bulk_input){$row[$meta_name]=[$row[$meta_name]];}
			}
			if(empty($row['meta_id'])){static::insert($row);}
			else{static::update($row);}
		}
	}
}
class_alias('Catpow\query\cpdb','cpdb_query');

?>