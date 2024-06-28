import { useState } from 'react';
import axios from 'axios';
import './register.css';

 
const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [errors, setErrors] = useState({});
  
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
        if (response.data.success) {
            // Redirect to Login
        }
      } catch (error) {
        // Consider setting up a logger for your application
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
    </form>
  );
};
export default Registration;
