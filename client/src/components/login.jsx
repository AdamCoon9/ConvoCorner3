import { useState } from 'react';
import axios from 'axios';
import './login.css';
import config from '../config.js'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(config.baseurl + '/login', { username, password });
      
      if (response.status === 200) { // Check if the status code is 200 (OK)
        if (response.data.username === username) {
          console.log('Login response:', response.data);
          // Store the username in local storage
          
          navigate('/dashboard', {state: {username: response.data.username}});
        } else {
          setErrorMessage('Invalid username or password');
        }
      } else if (response.status === 401) { // Check if the status code is 401 (Unauthorized)
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An error occurred during login');
      }
    } catch (error) {
      console.error('Error during login', error);
      setErrorMessage('An error occurred during login');
    }
  };  

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  ); 
};

export default Login;
