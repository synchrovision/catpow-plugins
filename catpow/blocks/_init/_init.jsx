const {Fragment} = wp.element;
const {registerBlockType} = wp.blocks;
const {InnerBlocks,BlockControls,AlignmentToolbar,BlockAlignmentToolbar,BlockVerticalAlignmentToolbar,PanelColorSettings,InspectorControls,RichText,RichTextToolbarButton,RichTextShortcut} = wp.editor;
const {PanelBody,BaseControl,TreeSelect,TextareaControl,TextControl,ServerSideRender,ToggleControl,SelectControl,CheckboxControl,RangeControl,Button,Toolbar,FormFileUpload} = wp.components;
const {registerFormatType,toggleFormat}=wp.richText;
const {__}=wp.i18n;
const el=wp.element.createElement;