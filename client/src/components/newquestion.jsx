import { useState } from 'react';
import axios from 'axios';
import '../index.css';


const NewQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText) {
      setErrorMessage('Question cannot be empty');
    } else if (!questionText.endsWith('?')) {
      setErrorMessage('Question must end with a question mark');
    } else {
      try {
        const response = await axios.post('/api/questions', { text: questionText });
        if (response.data.success) {
          // Redirect to Category2 questions screen
        }
      } catch (error) {
        // Consider setting up a logger for your application
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <textarea onChange={(e) => { setQuestionText(e.target.value); setErrorMessage(''); }} />
      <button type="submit">Submit Question</button>
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
};

export default NewQuestion;
