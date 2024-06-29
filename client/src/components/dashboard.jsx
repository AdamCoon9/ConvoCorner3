import { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        console.log('Categories:', response.data); // Log categories to console
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectCategory(category);
    const response = await axios.get(`/api/questions?category=${category}`);
    setQuestions(response.data);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div>
      <h1>ConvoCorner</h1>
      <p>
        Welcome,
        {username}
        !
      </p>
      <a href="/login" onClick={handleLogout}>Logout</a>
      <div className="dashboard-container">
        <div className="categories-container">
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="category-item" onClick={() => handleCategoryClick(category)}>
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="questions-container">
          <h2>Questions</h2>
          {selectCategory ? (
            <ul>
              {questions.map((question) => (
                <li key={question.id}>{question.text}</li>
              ))}
            </ul>
          ) : (
            <p>Please select a category</p>
          )}
        </div>
      </div> {/* This is the missing closing tag */}
    </div>
  );
};

export default Dashboard;
