import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Placeholder pages
import Home from './pages/Home';
import WomenSafety from './pages/WomenSafety';
import Documents from './pages/Documents';
import DocumentFlow from './pages/DocumentFlow';
import TriageResult from './pages/TriageResult';
import LawyerDashboard from './pages/LawyerDashboard';
import FindLawyer from './pages/FindLawyer';
import LawyerProfile from './pages/LawyerProfile';
import HowItWorks from './pages/HowItWorks';
import ChatPage from './pages/ChatPage';
import LawyerChat from './pages/LawyerChat';

// Simple placeholders for now
// const FindLawyer = () => <div className="container" style={{ padding: '40px' }}><h1>Find a Lawyer</h1><p>Coming soon...</p></div>;
// const HowItWorks = () => <div className="container" style={{ padding: '40px' }}><h1>How it works</h1><p>Coming soon...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="women-safety" element={<WomenSafety />} />
          <Route path="documents" element={<Documents />} />
          <Route path="document-flow" element={<DocumentFlow />} />
          <Route path="triage" element={<TriageResult />} />
          <Route path="lawyer-dashboard" element={<LawyerDashboard />} />
          <Route path="find-lawyer" element={<FindLawyer />} />
          <Route path="lawyer-profile" element={<LawyerProfile />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="lawyer-chat" element={<LawyerChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
