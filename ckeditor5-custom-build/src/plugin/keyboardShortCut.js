import _ from 'lodash';

// custom plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

let h1Cnt = 0;
let h2Cnt = 0;
let h3Cnt = 0;

let infoBoxCnt = 0;
let TipBoxCnt = 0;
let WarningBoxCnt = 0;

class KeyboardShortCut extends Plugin {
  init() {
    const editor = this.editor;

    editor.keystrokes.set('alt+q', (evt, cancel) => {
      editor.execute('heading', { value: 'paragraph' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+1', (evt, cancel) => {
      editor.execute('heading', { value: 'heading1' });
      editor.execute('style', { styleName: 'h1-underline' });
      h1Cnt++;
    }, { priority: 'high' });

    editor.keystrokes.set('alt+2', (evt, cancel) => {
      editor.execute('heading', { value: 'heading2' });
      editor.execute('style', { styleName: 'h2-underline' });
      h2Cnt++;
    }, { priority: 'high' });

    editor.keystrokes.set('alt+3', (evt, cancel) => {
      editor.execute('heading', { value: 'heading3' });
      editor.execute('style', { styleName: 'h3-underline' });
      h3Cnt++;
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
      editor.execute('fontSize', { value: 'small' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+x', (evt, cancel) => {
      editor.execute('fontSize', { value: 'default' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+c', (evt, cancel) => {
      editor.execute('fontSize', { value: 'big' });
    }, { priority: 'high' });

    editor.keystrokes.set(['alt', 'shift', 'z'], (evt, cancel) => {
      editor.execute('style', { styleName: 'info-box' });
      infoBoxCnt++;
    }, { priority: 'high' });

    editor.keystrokes.set(['alt', 'shift', 'x'], (evt, cancel) => {
      editor.execute('style', { styleName: 'tip-box' });
      TipBoxCnt++;
    }, { priority: 'high' });

    editor.keystrokes.set(['alt', 'shift', 'c'], (evt, cancel) => {
      editor.execute('style', { styleName: 'warning-box' });
      WarningBoxCnt++;
    }, { priority: 'high' });

    editor.keystrokes.set('tab', (evt, data) => {
      editor.execute('input', { text: "    " });
      evt.preventDefault();
    }, { priority: 'high' });

    editor.keystrokes.set('enter', (evt, data) => {
      if (h1Cnt > 0) {
        setTimeout(() => {
          editor.execute('heading', { value: 'heading1' });
          editor.execute('style', { styleName: 'h1-underline' });
          editor.execute('heading', { value: 'paragraph' });
          h1Cnt = 0;
        }, 1)
      }
      if (h2Cnt > 0) {
        setTimeout(() => {
          editor.execute('heading', { value: 'heading2' });
          editor.execute('style', { styleName: 'h2-underline' });
          editor.execute('heading', { value: 'paragraph' });
          h2Cnt = 0;
        }, 1)
      }
      if (h3Cnt > 0) {
        setTimeout(() => {
          editor.execute('heading', { value: 'heading3' });
          editor.execute('style', { styleName: 'h3-underline' });
          editor.execute('heading', { value: 'paragraph' });
          h3Cnt = 0;
        }, 1)
      }

      if (infoBoxCnt > 0) {
        setTimeout(() => {
          editor.execute('style', { styleName: 'info-box' });
          infoBoxCnt = 0;
        }, 1)
      }
      if (TipBoxCnt > 0) {
        setTimeout(() => {
          editor.execute('style', { styleName: 'tip-box' });
          TipBoxCnt = 0;
        }, 1)
      }
      if (WarningBoxCnt > 0) {
        setTimeout(() => {
          editor.execute('style', { styleName: 'warning-box' });
          WarningBoxCnt = 0;
        }, 1)
      }
    }, { priority: 'high' });
  }
}

export default KeyboardShortCut;