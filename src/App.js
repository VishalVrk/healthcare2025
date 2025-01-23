import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientRegistration from './components/PatientRegistration';
import AppointmentScheduler from './components/AppointmentScheduler';
import DoctorProfiles from './components/DoctorProfiles';
import PrescriptionManager from './components/PrescriptionManager';
import DoctorRegistration from './components/DoctorRegistration';
import Layout from './components/Layout';
import PredictiveHealthAnalytics from './components/PredictiveHealthAnalytics'
import DiseaseRiskAssessment from './components/DiseaseRiskAssessment'
import TreatmentRecommendationEngine from './components/TreatmentRecommendationEngine'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Router>
      {user ? (
        <div className="bg-gray-100 min-h-screen">
          <nav className="bg-blue-500 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/dashboard" className="text-xl font-bold">
                Healthcare Dashboard
              </Link>
              <div className="space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
          <Layout>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/appointment-scheduler" element={<AppointmentScheduler />} />
            <Route path="/doctor-profiles" element={<DoctorProfiles />} />
            <Route path="/prescription-manager" element={<PrescriptionManager />} />
            <Route path="/doctor-registration" element={<DoctorRegistration />} />
            <Route path="/health-analytics" element={<PredictiveHealthAnalytics />} />
            <Route path="/disease-risk" element={<DiseaseRiskAssessment />} />
            <Route path="/treatment-recommendation" element={<TreatmentRecommendationEngine />} />
          </Routes>
            </Layout>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;