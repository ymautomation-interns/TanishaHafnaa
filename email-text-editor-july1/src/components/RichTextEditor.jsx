import { useState, useRef, useEffect } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ placeholder = "Type your email here...", onChange }) => {
  const editorRef = useRef(null);

  const formatDoc = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateContent();
  };

  const updateContent = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Font Awesome would ideally be installed or linked in index.html.
  // We'll use a simple fallback if icons aren't available, but we assume
  // they are in the index.html head for a real app.

  return (
    <div className="rich-text-editor-container">
      <div className="toolbar">
        <div className="toolbar-group">
          <button type="button" onClick={() => formatDoc('bold')} title="Bold">
             <b>B</b>
          </button>
          <button type="button" onClick={() => formatDoc('italic')} title="Italic">
             <i>I</i>
          </button>
          <button type="button" onClick={() => formatDoc('underline')} title="Underline">
             <u>U</u>
          </button>
        </div>
        
        <div className="toolbar-group">
          <select 
            onChange={(e) => formatDoc('fontSize', e.target.value)} 
            title="Font Size"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>
        
        <div className="toolbar-group">
          <input 
            type="color" 
            onChange={(e) => formatDoc('foreColor', e.target.value)} 
            title="Text Color" 
            defaultValue="#f8fafc"
          />
        </div>

        <div className="toolbar-group">
          <button type="button" onClick={() => formatDoc('justifyLeft')} title="Align Left">
             L
          </button>
          <button type="button" onClick={() => formatDoc('justifyCenter')} title="Align Center">
             C
          </button>
          <button type="button" onClick={() => formatDoc('justifyRight')} title="Align Right">
             R
          </button>
        </div>
        
        <div className="toolbar-group">
          <button type="button" onClick={() => formatDoc('insertUnorderedList')} title="Bullet List">
             • List
          </button>
          <button type="button" onClick={() => formatDoc('insertOrderedList')} title="Numbered List">
             1. List
          </button>
        </div>
      </div>
      
      <div 
        ref={editorRef}
        className="editor-content" 
        contentEditable={true} 
        data-placeholder={placeholder}
        onInput={updateContent}
        onBlur={updateContent}
      ></div>
    </div>
  );
};

export default RichTextEditor;
