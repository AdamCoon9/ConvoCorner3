import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../index.css';


const QuestionView = ({ questionId }) => {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      const questionResponse = await axios.get(`/api/questions/${questionId}`);
      setQuestion(questionResponse.data);
      const answersResponse = await axios.get(`/api/questions/${questionId}/answers`);
      setAnswers(answersResponse.data);
    };
    fetchQuestionAndAnswers();
  }, [questionId]);
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/questions/${questionId}/answers`, { text: answerText });
      if (response.data.success) {
        const answersResponse = await axios.get(`/api/questions/${questionId}/answers`);
        setAnswers(answersResponse.data);
        setShowModal(false);
      }
    } catch (error) {
      // Consider setting up a logger for your application
    }
  };
  return (
    <div>
      <h2>{question.text}</h2>
      <button onClick={() => setShowModal(true)}>Answer</button>
      {showModal && (
        <div>
          <form onSubmit={handleAnswerSubmit}>
            <textarea onChange={(e) => setAnswerText(e.target.value)} />
            <button type="submit">Submit Answer</button>
          </form>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
      <ul>
        {answers.map((answer) => (
          <li key={answer.id}>{answer.text}</li>
        ))}
      </ul>
    </div>
  );
};

QuestionView.propTypes = {
  questionId: PropTypes.string.isRequired,
};

export default QuestionView;
