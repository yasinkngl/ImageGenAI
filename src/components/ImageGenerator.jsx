import React, { useState, useEffect } from 'react';
import './ImageGenerator.css';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import axios from 'axios';

const ImageGenerator = () => {
  // State for user input prompt
  const [prompt, setPrompt] = useState('');
  // State for the generated image URL
  const [imageUrl, setImageUrl] = useState('');
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');
  // State for prompt history
  const [history, setHistory] = useState([]);

  // Fetch prompt history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/prompts');
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch prompt history.');
    }
  };

  // Handler for prompt input changes
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // Handler for the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset any previous errors

    if (!prompt.trim()) {
      setError('Please enter a valid prompt.');
      return;
    }

    try {
      setIsLoading(true);
      // Construct the Pollinations endpoint URL
      const encodedPrompt = encodeURIComponent(prompt.trim().replace(/\s+/g, '-'));
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

      // To prevent caching, append a timestamp
      const finalUrl = `${url}?t=${Date.now()}`;

      // Set the generated image URL
      setImageUrl(finalUrl);

      // Save the prompt and image URL to the backend
      const newPrompt = { prompt: prompt.trim(), imageUrl: finalUrl };
      await axios.post('http://localhost:5000/api/prompts', newPrompt);

      // Update the history state
      setHistory([newPrompt, ...history]);

      // Clear the input field
      setPrompt('');
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-generator">
      <h1>AI ImageGen</h1>
      <p className="subheader">
        Inspirational images from the top AI generators. Simply enter a subject, we'll apply styles, and you'll tweak the one you like.
      </p>
      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={handlePromptChange}
          className="prompt-input"
          aria-label="Text prompt"
        />
        <button type="submit" className="generate-button" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      <p className="smart-suggestion">
        Smart Suggestion: Focus on detailed subject descriptions, rather than style.
      </p>

      {error && <ErrorMessage message={error} />}

      {isLoading && <LoadingSpinner />}

      {imageUrl && !isLoading && !error && (
        <div className="image-preview">
          <img
            src={imageUrl}
            alt="Generated visual representation"
            loading="lazy"
            onLoad={() => {}}
            onError={() => setError('Failed to load image. Please try a different prompt.')}
          />
        </div>
      )}

      {/* Prompt History Section */}
      <div className="prompt-history">
        <h2>Prompt History</h2>
        {history.length === 0 ? (
          <p>No prompts yet.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index} className="history-item">
                <p><strong>Prompt:</strong> {item.prompt}</p>
                <img src={item.imageUrl} alt={`Generated for ${item.prompt}`} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
