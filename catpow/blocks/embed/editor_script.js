/*
* 有効化されている機能が提供する埋め込み用コード
* functions/[funciton]/blocks.php を埋め込み、もしくは 
* Catpow\blocks\[funciton]::render();を実行
*/
registerBlockType('catpow/embed', {
  title: '🐾 Embed',
  icon: 'editor-code',
  category: 'catpow-embed',
  example: CP.example,
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
        setAttributes = _ref.setAttributes,
        className = _ref.className;
    var func = attributes.func,
        param = attributes.param;

    var statesClasses = void 0,
        panels = void 0;

    if (func) {
      statesClasses = cpEmbeddablesTree.embed[func].conf.map(function (conf) {
        conf.json = 'param';
        return conf;
      });
    }

    return [wp.element.createElement(
      'div',
      { 'class': 'embedded_content' },
      wp.element.createElement(
        'div',
        { 'class': 'label' },
        func
      ),
      wp.element.createElement(ServerSideRender, { block: 'catpow/embed', attributes: attributes })
    ), wp.element.createElement(
      InspectorControls,
      null,
      wp.element.createElement(
        PanelBody,
        { title: 'Path' },
        wp.element.createElement(TreeSelect, {
          label: 'path',
          selectedId: func,
          tree: cpEmbeddablesTree.embed,
          onChange: function onChange(func) {
            setAttributes({ func: func });
          }
        })
      ),
      statesClasses && wp.element.createElement(SelectClassPanel, {
        title: '\u8A2D\u5B9A',
        icon: 'admin-appearance',
        set: setAttributes,
        attr: attributes,
        selectiveClasses: statesClasses
      })
    )];
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes,
        className = _ref2.className,
        setAttributes = _ref2.setAttributes;

    return 'null';
  }
});
