module.exports = (Quill, ReactQuill) => {
  let icons = ReactQuill.Quill.import('ui/icons');
  let BlockEmbed = Quill.import('blots/block/embed');

  class DividerBlot extends BlockEmbed { }
  DividerBlot.blotName = 'divider';
  DividerBlot.tagName = 'hr';

  Quill.register('formats/divider', DividerBlot);
  icons['divider'] = `<span role="img" aria-label="minus" class="anticon anticon-minus"><svg viewBox="64 64 896 896" focusable="false" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></span>`;
  return DividerBlot;
}