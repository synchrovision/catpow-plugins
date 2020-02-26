<?php
if($_REQUEST['setup_type']==='create'){
	if(is_multisite()){
		if(\SUBDOMAIN_INSTALL){$theme_name='catpow-'.explode('.',get_blog_details()->domain)[0];}
		else{$theme_name='catpow-'.basename(get_blog_details()->path);}
	}
	else{$theme_name='catpow-'.$_SERVER['HTTP_HOST'];}
	if(file_exists(get_theme_root().'/'.$theme_name)){
		$i=1;
		while(file_exists(get_theme_root().'/'.$theme_name.'-'.$i)){$i++;}
		$theme_name=$theme_name.'-'.$i;
	}
	dir_copy(WP_PLUGIN_DIR.'/catpow/theme_default',get_theme_root().'/'.$theme_name);
	$allowedthemes=get_option('allowedthemes');
	$allowedthemes[$theme_name]=true;
	update_option('allowedthemes',$allowedthemes);
	echo("create new theme : {$theme_name}");
}
else if($_REQUEST['setup_type']==='template'){
	try{
        global $cptc;
        Catpow\template_creator::init();
		$cptc->create();
		$cptc->log();
	}
	catch(Exception $e){
		printf('%s at %s:line %s',$e->getMessage(),$e->getFile(),$e->getLine());
	}
}
else if($_REQUEST['setup_type']==='post'){
	$contents=[];
	cp::conf_data_walk(function($data_type,$data_name,$conf_data)use(&$contents){
		if(isset($conf_data['article_type'])){
			$class_name=cp::get_class_name('article_type',$conf_data['article_type']);
			$contents+=$class_name::get_default_post_datas($conf_data);
		}
		if(isset($conf_data['template'])){
			foreach($conf_data['template'] as $template){
				$class_name=cp::get_class_name('template_type',explode('-',$template)[0]);
				$contents+=$class_name::get_default_post_datas($conf_data);
			}
		}
	});
	ksort($contents);
	array_walk($contents,function($post_data,$path){
		if(empty(cp::get_post($path))){
			$post_data=array_merge(cp::get_default_post_data($path),$post_data);
			$post_id=wp_insert_post($post_data);
			if(!empty($post_data['meta'])){
				foreach($post_data['meta'] as $key=>$vals){
					if(is_array($vals)){
						foreach($vals as $val){
							add_post_meta($post_id,$key,$val);
						}
					}
					else{
						add_post_meta($post_id,$key,$vals);
					}
				}
			}
			if($path==='page/home'){
				update_option('show_on_front','page');
				update_option('page_on_front',$post_id);
			}
			printf("page created : %s <br/>",$path);
		}
	});
}
else if($_REQUEST['setup_type']==='user'){
	global $user_datas;
	$cnt1=$cnt2=0;
    $role_datas=get_option('wp_user_roles');
	foreach($user_datas as $role_name=>$user_data){
		if($role_name==='guest' || $role_name==='common'){continue;}
		if(isset($user_data['capabilities'])){
            if(is_array($user_data['capabilities'])){
                $cap=[];
                foreach($user_data['capabilities'] as $c){
                    if(isset($role_datas[$c])){
                        $cap=array_merge($cap,$role_datas[$c]['capabilities']);
                    }
                    else{$cap[$c]=true;}
                }
            }
            else{
                $cap=get_role($user_data['capabilities'])->capabilities;
            }
		}
		else{$cap=get_role('subscriber')->capabilities;}
		$role=get_role($role_name);
		if(is_null($role)){
			add_role($role_name,$user_data['label'],$cap);
			printf('create %s(%s)<br/>',$user_data['label'],$role_name);
			$cnt1++;
		}
		elseif(isset($user_data['capabilities'])){
			$cap_to_add=array_diff_assoc($cap,$role->capabilities);
			foreach($cap_to_add as $key=>$val){
				$role->add_cap($key);
				printf('add cap %s(%s) %s <br/>',$key,$user_data['label'],$role_name);
				$cnt2++;
			}
			$cap_to_remove=array_diff_assoc($role->capabilities,$cap);
			foreach($cap_to_remove as $key=>$val){
				$role->remove_cap($key);
				printf('remove cap %s(%s) %s<br/>',$key,$user_data['label'],$role_name);
				$cnt2++;
			}
		}
	}
	printf('%d roles created<br/>',$cnt1);
	printf('%d role capabilities update',$cnt2);
}
else if($_REQUEST['setup_type']==='menu'){
	global $nav_datas;
	$locations=get_theme_mod('nav_menu_locations');
    $cnt=0;
	$default_menu_items=[];
	foreach($GLOBALS['static_pages'] as $data_name=>$conf){
		if($post=get_page_by_path($conf['page_path'])){
			$menu_item=[
				'menu-item-title'=>$conf['label'],
				'menu-item-object-id'=>$post->ID,
				'menu-item-object'=>'page',
				'menu-item-status'=>'publish',
				'menu-item-type'=>'post_type',
				'parent'=>$conf['parent']??null
			];
			if(isset($conf['menu'])){
				foreach((array)$conf['menu'] as $menu_type){
					$default_menu_items[$menu_type][$conf['page_path']]=$menu_item;
				}
			}
			else{
				$default_menu_items['sitemap'][$conf['page_path']]=$menu_item;
				if(isset($conf['parent'])){$page_name=explode('/',$conf['parent'])[0];}
				else{$page_name=$data_name;}
				switch($page_name){
					case 'inqury':
					case 'contact':
					case 'download':
						$default_menu_items['primary'][$conf['page_path']]=$menu_item;
						break;
					case 'faq':
					case 'terms':
					case 'agreement':
					case 'privacy':
						$default_menu_items['sub'][$conf['page_path']]=$menu_item;
						break;
					default:
						$default_menu_items['main'][$conf['page_path']]=$menu_item;
				}
				
			}
			
		}
	}
	foreach($nav_datas as $menu_name=>$menu_data){
		if(!has_nav_menu($menu_name)){
            if($menu_object=wp_get_nav_menu_object($menu_name)){
                $locations[$menu_name]=$menu_object->term_id;
                printf('allocate menu to %s<br/>',$menu_name);
                $cnt++;
            }
            else{
                $locations[$menu_name]=wp_update_nav_menu_object(0,array('menu-name'=>$menu_name,'slug'=>$menu_name));
                printf('create and allocate menu to %s<br/>',$menu_name);
				$menu_item_created[$menu_name]=[];
				if(isset($menu_data['type'])){
					$menu_type=$menu_data['type'];
				}
				else{
					switch($menu_name){
						case 'sitemap':
							$menu_type='sitemap';break;
						case 'header':
						case 'side':
							$menu_type='main';break;
						case 'primary':
							$menu_type='primary';break;
						default:
							$menu_type='sub';
					}
				}
				foreach((array)$default_menu_items[$menu_type] as $page_path=>$menu_item){
					if(isset($menu_item['parent']) && isset($menu_item_created[$menu_name][$menu_item['parent']])){
						$menu_item['menu-item-parent-id']=$menu_item_created[$menu_name][$menu_item['parent']];
					}
					$menu_item_created[$menu_name][$page_path]=wp_update_nav_menu_item($locations[$menu_name],'',$menu_item);
				}
                $cnt++;
            }
		}
	}
	printf('%d menus updated',$cnt);
    set_theme_mod('nav_menu_locations',$locations);
}
else if($_REQUEST['setup_type']==='db'){
	global $wpdb,$cpdb;
	require_once( ABSPATH.'wp-admin/includes/upgrade.php');
	
	$org_tables=$cpdb->tables;
	
	$created_tables=[];
	$update_logs=[];
	$table_data=[];
	
	$fnc_update_cpdb_table=function($name,$conf)use(&$fnc_update_cpdb_table,&$created_tables,&$update_logs,&$table_data,$org_tables){
		global $wpdb,$cpdb;
		$rtn=[];
        $class_name=cp::get_class_name('meta',$conf['type']);
        if(!$class_name::$is_database){return $rtn;}
		
		$unique_key='meta_id';
		
		$table_name=cpdb::get_table_name($name);
		if(!isset($table_data[$table_name])){
			$table_data[$table_name]=[
				'path'=>$name,
				'columns'=>[],
				'children'=>[],
				'parent'=>(($cnt=count($name))>3)?cpdb::get_table_name(array_slice($name,0,$cnt-1)):false
			];
		}
		
		$table_data[$table_name]['has_parent']=$class_name::$has_parent;
        $table_data[$table_name]['alias']=$conf['alias']?:str_replace('/','_',$conf['path']);
        
        
		$cols=[];
		foreach($conf['meta'] as $col_name=>$col_data){
            $col_class_name=cp::get_class_name('meta',$col_data['type']);
			if($col_class_name::$is_database){
				$rtn=array_merge($rtn,$fnc_update_cpdb_table(array_merge($name,[$col_name]),$col_data));
				$table_data[$table_name]['children'][$col_name]=cpdb::get_table_name(array_merge($name,[$col_name]));
				continue;
			}
			$multiple=(!empty($col_data['multiple']) or $col_class_name::$is_bulk_input);
			$has_children=$col_class_name::$has_children;
			$cols[$col_name]=['type'=>$col_data['type'],'multiple'=>$multiple,'has_children'=>$has_children];
			if(isset($col_class_name::$data_type) and !$multiple){
				$cols[$col_name]['data_type']=strtolower($col_class_name::$data_type);
			}
			else{$cols[$col_name]['data_type']='longtext';}
			if(isset($col_data['default'])){
				$default=$col_data['default'];
				if(is_array($default)){$default=serialize($default);}
				if(is_string($default)){$default=sprintf('"%s"',$default);}
				$cols[$col_name]['default']=$default;
			}
		}
		$table_data[$table_name]['columns']=$cols;
		if(in_array($table_name,$org_tables) and $cpdb->query("SHOW TABLES LIKE '{$table_name}'")->fetch(PDO::FETCH_NUM)){
			$org_cols=[];
            
			foreach($cpdb->query('SHOW COLUMNS FROM '.$table_name) as $org_col_data){
				$org_col_name=$org_col_data[0];
				if(in_array($org_col_name,['meta_id','root_object_id','parent_id']))continue;
				$org_cols[$org_col_name]=['data_type'=>$org_col_data[1]];
				if(!is_null($org_col_data[4]))$org_cols[$org_col_name]['default']=$org_col_data[4];
			}
			$new_cols=array_diff_key($cols,$org_cols);
			$com_cols=array_intersect_key($cols,$org_cols);
			$del_cols=array_diff_key($org_cols,$cols);
			foreach($new_cols as $new_col_name=>$new_col){
				$sql="ALTER TABLE {$table_name} ADD `{$new_col_name}` {$new_col['data_type']}";
				if(isset($new_col['default']))$sql.=' DEFAULT '.$new_col['default'];
				$sql.=';';
				$cpdb->query($sql);
				$update_logs[$table_name][]='create column '.$new_col_name;
			}
			foreach($com_cols as $com_col_name=>$com_col){
				if($com_cols['data_type']==$org_cols['data_type'])continue;
				$cpdb->query("ALTER TABLE {$table_name} MODIFY `{$com_col_name}` {$com_cols['data_type']};");
				$update_logs[$table_name][]='modify column '.$com_col_name.
					' from '.$org_cols['data_type'].
					' to '.$com_cols['data_type'];
			}
			foreach($del_cols as $del_col_name=>$del_col){
				$cpdb->query("ALTER TABLE {$table_name} DROP `{$del_col_name}`;");
				$update_logs[$table_name][]='delete column '.$del_col_name;
			}
		}
		else{
			$sql="CREATE TABLE IF NOT EXISTS {$table_name}(\n";
			$sql.="{$unique_key} bigint(20) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n";
			if($class_name::$has_parent){
				$sql.="root_object_id longtext,\n";
				$sql.="parent_id longtext,\n";
			}
			foreach($cols as $col_name=>$col_data){
				$sql.="`{$col_name}` {$col_data['data_type']}";
				if(isset($col_data['default'])){$sql.=' DEFAULT '.$default;}
				$sql.=",\n";
			}
			$sql.="UNIQUE KEY {$unique_key} ({$unique_key})\n";
			$sql.=') '.$wpdb->get_charset_collate().';';
			$cpdb->query($sql);
			$created_tables[]=$table_name;
		}
		$rtn[]=$table_name;
		return $rtn;
	};
	$new_tables=[];
	cp::conf_data_walk(function($data_type,$data_name,$conf_data)use($fnc_update_cpdb_table,&$new_tables){
		if(empty($conf_data['meta']))return;
		foreach($conf_data['meta'] as $meta_name=>$conf){
			$new_tables=array_merge($new_tables,$fnc_update_cpdb_table([$data_type,$data_name,$meta_name],$conf));
		}
	});
	
	$deleted_tables=array_diff($org_tables,$new_tables);
	printf('created: %d tables<br/><br/>',count($created_tables));
	if(!empty($created_tables)){
		echo('　');
		echo implode('<br/>　',$created_tables).'<br/><br/>';
	}
	printf('updated: %d tables<br/><br/>',count($update_logs));
	if(!empty($update_logs)){
		foreach($update_logs as $table_name=>$update_log){
			echo '　'.$table_name.':<br/>　　';
			echo implode('<br/>　　',$update_log).'<br/><br/>';
		}
	}
	printf('deleted: %d tables<br/><br/>',count($deleted_tables));
	if(!empty($deleted_tables)){
		echo('　');
		$cpdb->query('DROP TABLE IF EXISTS '.implode(',',$deleted_tables).';');
		echo implode('<br/>　',$deleted_tables).'<br/><br/>';
	}
	update_option('cpdb_tables',$table_data);
}