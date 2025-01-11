import _ from 'lodash';

// custom plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

let underline = 0;
let h1 = 0;
let h2 = 0;
let h3 = 0;
class KeyboardShortCut extends Plugin {
  init() {
    const editor = this.editor;

    editor.keystrokes.set('alt+q', (evt, cancel) => {
      editor.execute('heading', { value: 'paragraph' });
    }, { priority: 'high' });

    editor.keystrokes.set('alt+w', (evt, cancel) => {
      editor.execute('code');
      evt.preventDefault();
    }, { priority: 'high' });

    editor.keystrokes.set('alt+e', (evt, cancel) => {
      editor.execute('blockQuote');
      evt.preventDefault();
    }, { priority: 'high' });

    editor.keystrokes.set('alt+1', (evt, cancel) => {
      editor.execute('heading', { value: 'heading1' });
      if(underline < 1) {
        editor.execute('style', { styleName: 'h1-underline' });
      }
      underline++;
      if(h1 > 0) {
        editor.execute('style', { styleName: 'h1-underline' });
        h3 = 0;
        h2 = 0;
        h1 = 0;
        underline = 0;
      } else {
        h1++;
      }
    }, { priority: 'high' });

    editor.keystrokes.set('alt+2', (evt, cancel) => {
      editor.execute('heading', { value: 'heading2' });
      if(underline < 1) {
        editor.execute('style', { styleName: 'h2-underline' });
      }
      underline++;
      if(h2 > 0) {
        editor.execute('style', { styleName: 'h2-underline' });
        h3 = 0;
        h2 = 0;
        h1 = 0;
        underline = 0;
      } else {
        h2++;
      }
    }, { priority: 'high' });

    editor.keystrokes.set('alt+3', (evt, cancel) => {
      editor.execute('heading', { value: 'heading3' });
      if(underline < 1) {
        editor.execute('style', { styleName: 'h3-underline' });
      }
      underline++;
      if(h3 > 0) {
        editor.execute('style', { styleName: 'h3-underline' });
        h3 = 0;
        h2 = 0;
        h1 = 0;
        underline = 0;
      } else {
        h3++;
      }
    }, { priority: 'high' });

    editor.keystrokes.set('alt+4', (evt, cancel) => {
      editor.execute('heading', { value: 'heading4' });
      h3 = 0;
      h2 = 0;
      h1 = 0;
    }, { priority: 'high' });

    editor.keystrokes.set('alt+5', (evt, cancel) => {
      editor.execute('heading', { value: 'heading5' });
      h3 = 0;
      h2 = 0;
      h1 = 0;
    }, { priority: 'high' });

    editor.keystrokes.set('alt+a', (evt, cancel) => {
      editor.execute('superscript');
    }, { priority: 'high' });

    editor.keystrokes.set('alt+s', (evt, cancel) => {
      editor.execute('highlight', { value: 'yellowMarker' });
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
      console.log('infoBox');
      editor.execute('style', { styleName: 'info-box' });
    }, { priority: 'high' });

    editor.keystrokes.set(['alt', 'shift', 'x'], (evt, cancel) => {
      editor.execute('style', { styleName: 'tip-box' });
    }, { priority: 'high' });

    editor.keystrokes.set(['alt', 'shift', 'c'], (evt, cancel) => {
      editor.execute('style', { styleName: 'warning-box' });
    }, { priority: 'high' });

    editor.keystrokes.set('tab', (evt, data) => {
      editor.execute('input', { text: "    " });
      evt.preventDefault();
    }, { priority: 'high' });

    editor.keystrokes.set('enter', (evt, data) => {
      console.log('enter');
      underline = 0;
      h3 = 0;
      h2 = 0;
      h1 = 0;
      
      editor.model.change(writer => {
        const selection = editor.model.document.selection;
        const position = selection.getFirstPosition(); // 커서 위치
    
        // 커서 위치의 부모 요소를 찾기
        const parentElement = position.findAncestor('paragraph') ?? position.findAncestor('heading1') ?? position.findAncestor('heading2') ?? position.findAncestor('heading3') ?? position.findAncestor('heading4') ?? position.findAncestor('heading5');
        if (parentElement) {
            evt.preventDefault();
            // 부모 요소 바로 뒤에 새 위치 설정
            const newPosition = writer.createPositionAfter(parentElement);
    
            // 새로운 요소 생성
            const newElement = writer.createElement('paragraph');
    
            // 새 요소 삽입
            writer.insert(newElement, newPosition);
    
            // 삽입된 요소로 커서 이동
            writer.setSelection(newElement, 'in');
        }
      });
    }, { priority: 'high' });
  }
}

export default KeyboardShortCut;