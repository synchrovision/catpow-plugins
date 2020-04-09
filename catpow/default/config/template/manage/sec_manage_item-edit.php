<?php namespace Catpow; ?>
<table class="manage">
	<!--meta-->
	<tr>
		<th><!--label--></th>
		<td><?php input('<!--name-->'); ?></td>
	</tr>
	<!--/meta-->
</table>
<ul class="buttons center">
	<li class="item close danger"><?php button(_('削除'),'delete','remove');?></li>
	<li class="item refresh"><?php button(_('更新'),'push','replace');?></li>
</ul>
