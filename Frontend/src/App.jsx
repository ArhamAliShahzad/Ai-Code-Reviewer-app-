import { useState, useEffect } from 'react';
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from 'axios';
import './App.css';
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";

function App() {
  const [code, setCode] = useState(`// Welcome to CodeAnalyzer Pro
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => prism.highlightAll(), []);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(data);
    } catch (error) {
      setReview('**Error:** Failed to analyze code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="editor-container">
        <div className="window-controls">
          <div className="control red"></div>
          <div className="control yellow"></div>
          <div className="control green"></div>
        </div>
        <div className="code-window">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={20}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 15,
              lineHeight: '1.8',
              background: 'transparent'
            }}
          />
        </div>
        <button
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          onClick={analyzeCode}
          disabled={isLoading}
        >
          {!isLoading ? (
            <>
              Analyze Code
              <svg className="rocket-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </button>
      </div>

      <div className="output-window">
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control red"></div>
            <div className="control yellow"></div>
            <div className="control green"></div>
          </div>
          <h2>Analysis Report</h2>
        </div>
        <div className="terminal-body">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review || '// Your analysis will appear here...'}
          </Markdown>
        </div>
      </div>
    </main>
  );
}

export default App;