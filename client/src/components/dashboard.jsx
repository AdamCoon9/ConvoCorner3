import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const { state } = useLocation();
  const [username] = useState(state.username);
  const [category, setCategory] = useState([]);
  const [question, setQuestion] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [submitQuestion, setSubmitQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [setNewAnswer] = useState('');
  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };
  const [inputValue, setInputValue] = useState('');
  <input value={inputValue} onChange={e => setInputValue(e.target.value)} />;
  const inputRefs= useRef({});



  

  useEffect(() => {
    if (submitQuestion && newQuestion && selectCategory && username) {
      const postQuestion = async () => {
        try {
          const response = await axios.post('/api/question', {
            question: newQuestion,
            category: selectCategory,
            askedBy: username // Include the username here
          });
          setQuestion(oldQuestion => [...oldQuestion, response.data]);
          setNewQuestion(''); // Clear the input field
          setSubmitQuestion(false); // Reset the submit state
        } catch (error) {
          console.error('Failed to post new question:', error);
        }
      };
      postQuestion();
    } else if (!username) {
    }
  }, [submitQuestion, newQuestion, selectCategory, username]);
  
  const handleAnswerQuestion = async (currentQuestionId) => {
    try {
      const questionId = currentQuestionId;
      console.log("questionid:", questionId)
      const newAnswer= inputRefs.current[questionId].value
      console.log("new answer:", newAnswer);
      const response = await axios.post('/api/answers', {
        answer: newAnswer,
        questionId: questionId,
        username: username
      });
      
      // Update the local state
      setQuestion(oldQuestion => {
        // Find the question being answered and add the new answer to it
        return oldQuestion.map(question =>
          question.id === response.data.questionId
            ? { ...question, answers: [...(question.answers || []), response.data] }
            : question
        );
      });
      setNewAnswer(''); // Clear the input field
    } catch (error) {
      console.error('Failed to post new answer:', error);
    }
  };
  
  const handleAskQuestion = async () => {

    
    if (newQuestion && selectCategory && username) { // Check if username is not empty
      try {
        const response = await axios.post('/api/question', {
          question: newQuestion,
          category: selectCategory,
          askedBy: username // Include the username here
        });
        setQuestion(oldQuestion => [...oldQuestion, response.data]);
        setNewQuestion(''); // Clear the input field
      } catch (error) {
        console.error('Failed to post new question:', error);
      }
    } else if (!username) {
      alert('Please log in before submitting a question.');
    }
  };
  

  useEffect(() => {
  

    const fetchCategory = async () => {
      try {
        const response = await axios.get('/api/category');  
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
      await axios.post('/api/logout', { token: localStorage.getItem('token') });
      
      // Remove the token from local storage
      localStorage.removeItem('token');
  
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
                    {question.map((q) => (
                      <li key={q.id}>{q.question}
                      <input type="text" ref={el => inputRefs.current[q.id] = el} value={q.answer} placeholder="Answer question" />
                      <button onClick={() => handleAnswerQuestion(q.id)}>Answer Question</button>
                      </li>
                    ))}
                  </ul>
                  <input type="" value={newQuestion} onChange={handleQuestionChange} placeholder="Ask a question" />
                  <button onClick={handleAskQuestion}>Ask</button>
                  
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