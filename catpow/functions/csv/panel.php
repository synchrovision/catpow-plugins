<?php namespace Catpow; ?>
<ul>
	<li>
		<h3>CSVをアップロード</h3>
		<label class="file" for="cp_admin_csv_upload">
			<span>アップロードするCSVを選択</span>
			<input id="cp_admin_csv_upload" type="file" name="csv" accept="text/csv"/>
		</label>
        <ul class="buttons">
            <li class="upload">
                <?php button('アップロード','action','update_results',['csv_action'=>'upload'],'section');?>
				<small>
					所定のフォーマットのCSVファイルから投稿もしくはユーザ登録を行います。
					文字エンコードがUTF-8のCSVのみ受け付けます。
				</small>
            </li>
		</ul>
	</li>
	<li>
		<h3>CSVをダウンロード</h3>
		<?php input('conf_data_path'); ?>
        <ul class="buttons">
            <li class="upload">
                <?php button('ダウンロード','action','download',['csv_action'=>'download'],'section');?>
				<small>指定したデータのCSVをダウンロードします。</small>
			</li>
		</ul>	
	</li>
</ul>