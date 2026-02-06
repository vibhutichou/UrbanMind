// Main application component with routing
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PostProvider } from "./context/PostContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Auth Pages
import LandingPage from "./components/Auth/LandingPage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Common Components
import CommonProfilePage from "./components/Common/Profile/CommonProfilePage";
import Settings from "./components/Common/Settings/Settings";
import ChatPage from "./components/Chats/ChatPage";

// Citizen Components
import CitizenDashboard from "./components/Citizen/CitizenDashboard";
import CreatePost from "./components/Citizen/CreatePost";
import ReportProblem from "./components/Citizen/ReportProblem";
import ReportedProblems from "./components/Citizen/ReportedProblems";
import CitizenProfileView from "./components/Citizen/Profile/CitizenProfileView";
import CitizenNotification from "./components/Citizen/CitizenNotification";
import Donation from "./components/Citizen/Donation";

// Volunteer Components
import VolunteerDashboard from "./components/Volunteer/VolunteerDashboard";
import VolunteerProfileView from "./components/Volunteer/VolunteerProfileView";
import Leaderboard from "./components/Volunteer/Leaderboard";
import VolunteerVerificationPage from "./components/Volunteer/Verification/VolunteerVerificationPage";
import MySolutions from "./components/Volunteer/MySolutions";
import VolunteerNotification from "./components/Volunteer/VolunteerNotification";

// NGO Components
import NGODashboard from "./components/NGO/NGODashboard";
import TeamPage from "./components/NGO/Team/TeamPage";
import ProjectsPage from "./components/NGO/Projects/ProjectsPage";
import VerificationPage from "./components/NGO/Verification/VerificationPage";
import NgoProfileView from "./components/NGO/Profile/NgoProfileView";
import NGONotification from "./components/NGO/NGONotification";
import NGOProjectDetails from "./components/NGO/NGOProjectDetails";

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminReports from "./components/Admin/AdminReports";
import AdminVerification from "./components/Admin/AdminVerification";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import AdminProfile from "./components/Admin/AdminProfile";

import AdminNotification from "./components/Admin/AdminNotifications";

// Donation Components
import DonationDashboard from "./components/Donation/DonationDashboard";
import DonationPaymentPage from "./components/Donation/DonationPaymentPage";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <UserProvider>
              <PostProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route path="/u/:userId" element={<CommonProfilePage />} />

                  {/* Citizen Routes */}
                  <Route
                    path="/citizen/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["citizen"]}>
                        <CitizenDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/citizen/create-post" element={<CreatePost />} />
                  <Route
                    path="/citizen/report-problem"
                    element={<ReportProblem />}
                  />
                  <Route
                    path="/citizen/reported-problems"
                    element={<ReportedProblems />}
                  />
                  <Route
                    path="/citizen/profile"
                    element={<CitizenProfileView />}
                  />
                  <Route path="/citizen/settings" element={<Settings />} />
                  <Route
                    path="/citizen/notifications"
                    element={<CitizenNotification />}
                  />
                  <Route path="/citizen/donate" element={<Donation />} />
                  <Route
                    path="/citizen/donations"
                    element={<DonationDashboard />}
                  />

                  {/* Volunteer Routes */}
                  <Route
                    path="/volunteer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["volunteer"]}>
                        <VolunteerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/volunteer/profile"
                    element={<VolunteerProfileView />}
                  />
                  <Route
                    path="/volunteer/leaderboard"
                    element={<Leaderboard />}
                  />
                  <Route
                    path="/volunteer/verification"
                    element={<VolunteerVerificationPage />}
                  />
                  <Route
                    path="/volunteer/report-problem"
                    element={<ReportProblem />}
                  />
                  <Route
                    path="/volunteer/solutions"
                    element={<MySolutions />}
                  />
                  <Route path="/volunteer/settings" element={<Settings />} />
                  <Route
                    path="/volunteer/notifications"
                    element={<VolunteerNotification />}
                  />
                  <Route
                    path="/volunteer/donations"
                    element={<DonationDashboard />}
                  />

                  {/* NGO Routes */}
                  <Route
                    path="/ngo/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["ngo"]}>
                        <NGODashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/ngo/team" element={<TeamPage />} />
                  <Route path="/ngo/projects" element={<ProjectsPage />} />
                  <Route
                    path="/ngo/verification"
                    element={<VerificationPage />}
                  />
                  <Route path="/ngo/profile" element={<NgoProfileView />} />
                  <Route path="/ngo/settings" element={<Settings />} />
                  <Route
                    path="/ngo/notifications"
                    element={<NGONotification />}
                  />
                  <Route
                    path="/ngo/project/:id"
                    element={<NGOProjectDetails />}
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route
                    path="/admin/verification"
                    element={<AdminVerification />}
                  />
                  <Route
                    path="/admin/users"
                    element={<AdminUserManagement />}
                  />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route
                    path="/admin/notifications"
                    element={<AdminNotification />}
                  />

                  {/* Donation Payment */}
                  <Route
                    path="/donate/:projectId"
                    element={<DonationPaymentPage />}
                  />

                  {/* Chats */}
                  <Route path="/chats" element={<ChatPage />} />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PostProvider>
            </UserProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
