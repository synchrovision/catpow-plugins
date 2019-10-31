<?php
namespace Catpow;

class conf implements \ArrayAccess{
	public $data;
	public function __construct($csv,$fill_column=false){
		if(is_array($csv)){
			$this->data=$csv;
		}
		else{
			$this->file=$csv;
			$csv=fopen($csv,'r');
			if(empty($fill_coumn)){
				while($row=fgetcsv($csv)){
					array_push($this->data,$row);
				}
			}
			else{
				$keys=fgetcsv($csv);
				array_push($this->data,$keys);
				if($fill_column===true){$fill_column=count($keys);}
				if(is_numeric($fill_column)){$fill_column=range(0,$fill_column);}
				elseif(is_string($fill_column)){$fill_column=[array_search($fill_column,$keys)];}
				elseif(is_array($fill_column)){
					foreach($fill_column as $i=>$key){
						if(!is_numeric($key)){$fill_column[$i]=array_search($key,$keys);}
					}
				}
				$current_values=[];
				while($row=fgetcsv($csv)){
					foreach($fill_column as $index){
						if(empty($row[$index])){$row[$index]=$current_values[$index];}
						else{$current_values[$index]=$row[$index];}
					}
					array_push($this->data,$row);
				}
			}
		}
	}
	
	public function offsetSet($offset,$value){
		if(empty($offset) || is_numeric($offset)){return false;}
		$this->data[$offset] = $value;
	}

	public function offsetExists($offset){
		return isset($this->data[$offset]);
	}

	public function offsetUnset($offset){
		unset($this->data[$offset]);
	}

	public function offsetGet($offset){
		if(isset($this->data[$offset])){return $this->data[$offset];}
	}
	
	
}


?>