import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState([]);
  const [question, setQuestion] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [submitQuestion, setSubmitQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setNewAnswer(event.target.value);
  };
 

  useEffect(() => {
    if (submitQuestion && newQuestion && selectCategory) {
      const postQuestion = async () => {
        try {
          const response = await axios.post('/api/question', {
            question: newQuestion,
            category: selectCategory
          });
          setQuestion(oldQuestion => [...oldQuestion, response.data]);
          setNewQuestion(''); // Clear the input field
          setSubmitQuestion(false); // Reset the submit state
        } catch (error) {
          console.error('Failed to post new question:', error);
        }
      };
      postQuestion();
    }
  }, [submitQuestion, newQuestion, selectCategory]);
  

  const handleAnswerQuestion = async (currentQuestionId) => {
    try {
      
      const questionId = currentQuestionId;
      const response = await axios.post('/api/answers', {
        text: newAnswer,
        questionId: questionId
      });
      
      // which you can then add to your local state:
      setQuestion(oldQuestion => {
        // Find the question being answered and add the new answer to it
        return oldQuestion.map(question =>
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
  
  const handleAskQuestion = async () => {
    setSubmitQuestion(true);
    if (newQuestion && selectCategory) {
      try {
        const response = await axios.post('/api/question', {
          question: newQuestion,
          category: selectCategory
        });
        setQuestion(oldQuestion => [...oldQuestion, response.data]);
        setNewQuestion(''); // Clear the input field
      } catch (error) {
        console.error('Failed to post new question:', error);
      }
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
    setSelectCategory(category.id.toString()); 
    try {
      const response = await axios.get(`/api/question?category=${category.id}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
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
            Welcome, {username}!
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
            <div className="question-container">
              <h2>Questions</h2>
              {selectCategory ? (
                <>
                  <ul>
                    {question.map((question) => (
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