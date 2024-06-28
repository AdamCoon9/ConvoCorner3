import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Dashboard from './components/dashboard.jsx';
import Login from './components/login.jsx';
import Register from './components/registration.jsx';
import NewQuestion from './components/newquestion.jsx';
import QuestionView from './components/questionview.jsx';

function QuestionViewWrapper() {
  let { id } = useParams();
  return <QuestionView questionId={id} />;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/questions/:id" element={<NewQuestion />} />
          <Route path="/answers/:id" element={<QuestionViewWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
