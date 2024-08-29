import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import List from './components/List';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
