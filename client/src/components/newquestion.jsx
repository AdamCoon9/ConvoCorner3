import { useState } from 'react';
import axios from 'axios';
import '../index.css';

const NewQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState(''); // Add state for category
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Submitting question:', questionText, 'Category:', category); // Log the question and category
    if (!questionText) {
      setErrorMessage('Question cannot be empty');
    } else if (!questionText.endsWith('?')) {
      setErrorMessage('Question must end with a question mark');
    } else if (!category) { // Check if category is selected
      setErrorMessage('Category must be selected');
    } else {
      try {
        const response = await axios.post('/api/question', { question: questionText, category });
        if (response.data.id) {
          console.log('Question submitted:', questionText); // Log submitted question
          // Clear the form here
          setQuestionText('');
          setCategory('');
        }
      } catch (error) {
        console.error('Failed to submit question:', error); // Log error
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea onChange={(e) => { setQuestionText(e.target.value); setErrorMessage(''); }} />
      <select onChange={(e) => { setCategory(e.target.value); setErrorMessage(''); }}> 
        <option value="">Select a category</option>
        <option value="wing-t">Wing-T</option>
        <option value="air-raid">Air Raid</option>
        <option value="run-and-shoot">Run and Shoot</option>
        <option value="wide-zone">Wide Zone</option>
        <option value="west-coast">West Coast</option>
      </select>
      <button type="submit" disabled={isSubmitting}>Submit</button>
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
};

export default NewQuestion;

