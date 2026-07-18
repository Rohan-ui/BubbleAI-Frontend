import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Dashboard } from '../pages/Dashboard';
import { ModuleInterface } from '../pages/ModuleInterface';
import { MyProjectWorkspace } from '../pages/MyProjectWorkspace';
import { TeamCommunityWorkspace } from '../pages/TeamCommunityWorkspace';
import { SettingsWorkspace } from '../pages/SettingsWorkspace';
import { BinWorkspace } from '../pages/BinWorkspace';
import { BubbleTreeWorkspace } from '../pages/BubbleTreeWorkspace';
import { AuthPage } from '../pages/AuthPage';

/**
 * ProtectedRoute — redirects to /auth if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin" />
          <span className="text-[#8a8a93] text-xs font-mono uppercase tracking-widest">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

/**
 * Main app content with sidebar/topbar layout
 */
function AppContent() {
  const location = useLocation();
  const isModuleView = location.pathname.startsWith('/module/');
  const isAuthView = location.pathname === '/auth';

  // Auth page has its own layout — no sidebar/topbar
  if (isAuthView) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-[#060608] text-white">
        {!isModuleView && <TopBar />}
        <div className="flex flex-1 overflow-hidden">
          {!isModuleView && <Sidebar />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-project" element={<MyProjectWorkspace />} />
              <Route path="/team-community" element={<TeamCommunityWorkspace />} />
              <Route path="/settings" element={<SettingsWorkspace />} />
              <Route path="/bin" element={<BinWorkspace />} />
              <Route path="/module/:id" element={<ModuleInterface />} />
              <Route path="/bubble-tree" element={<BubbleTreeWorkspace />} />
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
