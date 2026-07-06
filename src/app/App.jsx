import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Dashboard } from '../pages/Dashboard';
import { ModuleInterface } from '../pages/ModuleInterface';
import { MyProjectWorkspace } from '../pages/MyProjectWorkspace';
import { TeamCommunityWorkspace } from '../pages/TeamCommunityWorkspace';
import { SettingsWorkspace } from '../pages/SettingsWorkspace';
import { BinWorkspace } from '../pages/BinWorkspace';
import { BubbleTreeWorkspace } from '../pages/BubbleTreeWorkspace';

function AppContent() {
  const location = useLocation();
  const isModuleView = location.pathname.startsWith('/module/');

  return (
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
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
