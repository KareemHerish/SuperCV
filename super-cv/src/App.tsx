import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CVProvider, useCV } from './context/CVContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IntroView } from './components/IntroView';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { BuildCVView } from './components/BuildCVView';
import { AssessmentView } from './components/AssessmentView';
import { AskAIView } from './components/AskAIView';
import { RoadmapsView } from './components/RoadmapsView';
import { ReadinessView } from './components/ReadinessView';
import { ProjectsView } from './components/ProjectsView';
import { ContactView } from './components/ContactView';

import { TabSkeleton } from './components/SkeletonLoader';

// Smooth tab transition variants for fading out old content and fading in new content
const tabVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, authInitialMode, isTabLoading, isLoadingCVs } = useCV();
  const { user } = useAuth();
  const prevUserRef = useRef(user);

  useEffect(() => {
    // If user was previously logged in and now logged out (e.g. 30min inactivity), go to intro
    if (prevUserRef.current && !user) {
      if (activeTab !== 'intro' && activeTab !== 'auth') {
        setActiveTab('intro');
      }
    }
    prevUserRef.current = user;
  }, [user, activeTab, setActiveTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileView />;
      case 'build-cv':
        return <BuildCVView />;
      case 'roadmaps':
        return <RoadmapsView />;
      case 'assessment':
        return <AskAIView />;
      case 'readiness':
        return <ReadinessView />;
      case 'projects':
        return <ProjectsView />;
      case 'contact':
        return <ContactView />;
      case 'ask-ai':
        return <AskAIView />;
      default:
        return <BuildCVView />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'intro' ? (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <IntroView />
        </motion.div>
      ) : activeTab === 'auth' ? (
        <motion.div
          key="auth-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26, ease: 'easeInOut' }}
        >
          <AuthView initialMode={authInitialMode} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="min-h-screen bg-[var(--bg-background)] text-[var(--color-on-surface)] transition-colors duration-200"
        >
          <Sidebar />
          <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pr-16' : 'pr-72'}`}>
            <Header />
            <main className="w-full pt-16 bg-[var(--bg-background)] min-h-screen overflow-x-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full min-h-[calc(100vh-4rem)]"
                >
                  <AnimatePresence mode="wait">
                    {isTabLoading || (isLoadingCVs && activeTab === 'profile') ? (
                      <motion.div
                        key={`skeleton-${activeTab}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <TabSkeleton tab={activeTab} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`content-${activeTab}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {renderActiveTab()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CVProvider>
        <MainContent />
      </CVProvider>
    </AuthProvider>
  );
}

