import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './register.css';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};

    if (!username) formErrors.username = 'Username is required';
    if (!password) formErrors.password = 'Password is required';
    if (password !== confirmPassword) formErrors.confirmPassword = 'Passwords do not match';
    if (!checkbox) formErrors.checkbox = 'You must agree to the terms';

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('/api/register', { username, password });
        console.log('Server response:', response.data); // Log the server response

        if (response.data.success) {
          console.log('Registration successful, navigating to /login'); // Log before navigation
          navigate('/login');
        } else {
          console.log('Registration not successful, not navigating'); // Log if registration was not successful
        }
      } catch (error) {
        console.error('Failed to register:', error);
        console.log(error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value); delete errors.username; }} />
      {errors.username && <p>{errors.username}</p>}
      <input type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); delete errors.password; }} />
      {errors.password && <p>{errors.password}</p>}
      <input type="password" placeholder="Confirm Password" onChange={(e) => { setConfirmPassword(e.target.value); delete errors.confirmPassword; }} />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      <input type="checkbox" onChange={(e) => { setCheckbox(e.target.checked); delete errors.checkbox; }} />
      {errors.checkbox && <p>{errors.checkbox}</p>}
      <button type="submit">Register</button>
      <p>Once you've registered, click this link to login!<a href="/login">Login</a></p>
    </form>
  );
};

export default Registration;
