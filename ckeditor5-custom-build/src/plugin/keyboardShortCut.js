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

    editor.keystrokes.set('alt+z', (evt, cancel) => {
      editor.execute('style', { styleName: 'info-box' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+x', (evt, cancel) => {
      editor.execute('style', { styleName: 'tip-box' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+c', (evt, cancel) => {
      editor.execute('style', { styleName: 'caution-box' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+a', (evt, cancel) => {
      editor.execute('superscript');
    }, { priority: 'high' });

    editor.keystrokes.set('alt+s', (evt, cancel) => {
      editor.execute('highlight', { value: 'yellowMarker' });
    }, { priority: 'high' });


    editor.keystrokes.set('tab', (evt, data) => {
      editor.execute('input', { text: "    " });
      evt.preventDefault();
    }, { priority: 'high' });
  }
}

export default KeyboardShortCut;