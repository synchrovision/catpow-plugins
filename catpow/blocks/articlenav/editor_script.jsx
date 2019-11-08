registerBlockType('catpow/articlenav',{
	title:'🐾 ArticelNav',
	icon:'editor-ul',
	category:'catpow',
    parent:['catpow/sidecolumn'],
	edit({attributes,className,setAttributes}){
        return [
			<div className={className}>
                <ul class="article_nav">
					<li>
						<h3>[ArticleNav]</h3>
					</li>
				</ul>
			</div>
        ];
    },
	save({attributes,className,setAttributes}){
		return (
			<div className={className}></div>
		);
	}
});