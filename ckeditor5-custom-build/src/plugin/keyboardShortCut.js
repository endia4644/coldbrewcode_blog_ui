import _ from 'lodash';

// custom plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';


class KeyboardShortCut extends Plugin {
  init() {
    const editor = this.editor;

    editor.keystrokes.set('alt+q', (evt, cancel) => {
      editor.execute('heading', { value: 'paragraph' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+1', (evt, cancel) => {
      editor.execute('heading', { value: 'heading1' });
      editor.execute('style', { styleName: 'h1-underline' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+2', (evt, cancel) => {
      editor.execute('heading', { value: 'heading2' });
      editor.execute('style', { styleName: 'h2-underline' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+3', (evt, cancel) => {
      editor.execute('heading', { value: 'heading3' });
      editor.execute('style', { styleName: 'h3-underline' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+4', (evt, cancel) => {
      editor.execute('heading', { value: 'heading4' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+5', (evt, cancel) => {
      editor.execute('heading', { value: 'heading5' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+q', (evt, cancel) => {
      editor.execute('style', 'h1-underline');
    }, { priority: 'high' });

    editor.keystrokes.set('alt+w', (evt, cancel) => {
      editor.execute('style', 'h2-underline');
    }, { priority: 'high' });

    editor.keystrokes.set('alt+f1', (evt, cancel) => {
      editor.execute('style', { styleName: 'h1-underline' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+f2', (evt, cancel) => {
      editor.execute('style', { styleName: 'h2-underline' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+f3', (evt, cancel) => {
      editor.execute('style', { styleName: 'h3-underline' });
    }, { priority: 'high' });
  }
}

export default KeyboardShortCut;