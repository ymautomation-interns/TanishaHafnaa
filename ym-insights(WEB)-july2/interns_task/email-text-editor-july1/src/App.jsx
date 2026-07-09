import { useState } from 'react';
import RichTextEditor from './components/RichTextEditor';
import './App.css';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="app-container">
      <header>
        <h1>New Message</h1>
        <p>Compose your email below using our reusable React rich-text editor.</p>
      </header>
      
      <main>
        <RichTextEditor 
          placeholder="Type your email here..." 
          onChange={(html) => setContent(html)} 
        />
        
        {content && (
          <div className="preview">
            <h3>Output Preview:</h3>
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
