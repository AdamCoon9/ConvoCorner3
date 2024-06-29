import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setNewAnswer(event.target.value);
  };

  const handleAskQuestion = async () => {
    try {
      const response = await axios.post('/api/questions', {
        question: newQuestion,
        category: selectCategory
      });
      // The server should return the newly created question,
      // which you can then add to your local state:
      setQuestions(oldQuestions => [...oldQuestions, response.data]);
      setNewQuestion(''); // Clear the input field
    } catch (error) {
      console.error('Failed to post new question:', error);
    }
  };
  

  const handleAnswerQuestion = async (currentQuestionId) => {
    try {
      // Assuming 'newAnswer' is the answer text, and you have a questionId for the question being answered
      const questionId = currentQuestionId;
      const response = await axios.post('/api/answers', {
        text: newAnswer,
        questionId: questionId
      });
      // The server should return the newly created answer,
      // which you can then add to your local state:
      setQuestions(oldQuestions => {
        // Find the question being answered and add the new answer to it
        return oldQuestions.map(question =>
          question.id === response.data.questionId
            ? { ...question, answers: [...question.answers, response.data] }
            : question
        );
      });
      setNewAnswer(''); // Clear the input field
    } catch (error) {
      console.error('Failed to post new answer:', error);
    }
  };
  
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user'); 
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError(`Failed to fetch user: ${error.toString()}`); // Convert the error object to a string
      }
    };
    fetchUser();

    const fetchCategory = async () => {
      try {
        const response = await axios.get('/api/category'); 
        console.log('Category:', response.data); 
        setCategory(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setError('Failed to fetch category.'); 
      }
    };
    fetchCategory();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectCategory(category);
    try {
      const response = await axios.get(`/api/questions?category=${category}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };
  

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1>ConvoCorner</h1>
          <p>
            Welcome,
            {username}
            !
          </p>
          <a href="/login" onClick={handleLogout}>Logout</a>
          <div className="dashboard-container">
            <div className="category-container">
              <h2>Categories</h2>
              <ul>
                {category.map((category) => (
                  <li key={category.id} className="category-item" onClick={() => handleCategoryClick(category)}>
                    {category.category_name} {/* Render the category_name property of the category object */}
                  </li>
                ))}
              </ul>
            </div>
            <div className="questions-container">
              <h2>Questions</h2>
              {selectCategory ? (
                <>
                  <ul>
                    {questions.map((question) => (
                      <li key={question.id}>{question.text}</li>
                    ))}
                  </ul>
                  <input type="text" value={newQuestion} onChange={handleQuestionChange} placeholder="Ask a question" />
                  <button onClick={handleAskQuestion}>Ask</button>
                  <input type="text" value={newAnswer} onChange={handleAnswerChange} placeholder="Answer a question" />
                  <button onClick={handleAnswerQuestion}>Answer</button>
                </>
              ) : (
                <p>Please select a category</p>
              )}
            </div>
          </div> 
        </>
      )}
    </div>
  );
};

export default Dashboard;