<?php namespace Catpow; ?>
<ul>
    <li>
        <h3>テーマ</h3>
        <ul class="wp-block-catpow-buttons m">
            <li class="item refresh">
                <?php button('新規テーマ作成','action','replace',['setup_type'=>'theme']);?>
                <small>新規のcatpowテーマを作成します</small>
            </li>
            <li class="item refresh">
                <?php button('テンプレート生成','action','replace',['setup_type'=>'template']);?>
                <small>
                    config/system_config.phpの設定を元にテーマにテンプレートファイルを生成します。
                </small>
            </li>
        </ul>
    </li>
    <li>
        <h3>データ</h3>
        <ul class="wp-block-catpow-buttons m">
            <li class="item refresh">
                <?php button('投稿生成','action','replace',['setup_type'=>'posts']);?>
                <small>使用するテンプレートタイプを元に投稿を生成します</small>
            </li>
            <li class="item refresh">
                <?php button('ロール生成','action','replace',['setup_type'=>'role']);?>
                <small>config/system_config.phpの$user_datasの設定を元にユーザのロールを更新します</small>
            </li>
            <li class="item refresh">
                <?php button('メニュー生成','action','replace',['setup_type'=>'menu']);?>
                <small>config/system_config.phpの$menu_datasの設定を元にメニューを更新します</small>
            </li>
        </ul>
    </li>
    <li>
        <h3>データベース</h3>
        <ul class="wp-block-catpow-buttons m">
            <li class="item refresh">
                <?php button('データベース更新','action','replace',['setup_type'=>'database']);?>
                <small>
                    system_config.phpの設定を元にデータベーステーブルを生成・削除・更新します。
                    この操作はsystem_config.phpにおいて削除されたデータベースのテーブル、あるいはカラムを削除します。
                </small>
            </li>
        </ul>
	</li>
</ul>