import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import BookCatalog from './components/BookCatalog/BookCatalog';
import BookReader from './components/BookReader/BookReader';
import Dashboard from './components/Dashboard/Dashboard';
import Assignments from './components/Assignments/Assignments';
import Progress from './components/Progress/Progress';
import Notes from './components/Notes/Notes';
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/catalog" element={<BookCatalog />} />
        <Route path="/book/:bookId" element={<BookReader />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assignments" 
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/progress" 
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
