<?php
echo '<div class="'.$attr['classes'].'">';
echo Michelf\MarkdownExtra::defaultTransform($attr['code']);
echo '</div>';