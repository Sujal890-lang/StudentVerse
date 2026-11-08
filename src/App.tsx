import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { StudentProvider } from './context/StudentContext';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { AIStudyAssistant } from './pages/AIStudyAssistant';
import { Attendance } from './pages/Attendance';
import { Assignments } from './pages/Assignments';
import { Timetable } from './pages/Timetable';
import { SkillMap } from './pages/SkillMap';
import { Opportunities } from './pages/Opportunities';
import { Community } from './pages/Community';
import { ProjectHub } from './pages/ProjectHub';
import { Placement } from './pages/Placement';
import { Notes } from './pages/Notes';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Student Portal Modules wrapped with DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-assistant" element={<AIStudyAssistant />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/skill-map" element={<SkillMap />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/community" element={<Community />} />
                <Route path="/projects" element={<ProjectHub />} />
                <Route path="/placement" element={<Placement />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </StudentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

