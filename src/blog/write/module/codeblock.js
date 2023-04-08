module.exports = (Quill) => {
  const CodeBlock = Quill.import('formats/code-block');
  // See - https://github.com/quilljs/quill/blob/develop/modules/clipboard.js#L513
  CodeBlock.tagName = 'PRE';

  Quill.register({
    'formats/code-block': CodeBlock
  });
  return CodeBlock;
}