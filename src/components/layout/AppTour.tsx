import { useState, useEffect } from 'react';
import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';
import { STATUS } from 'react-joyride';

export function AppTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run the tour if the user hasn't seen it before
    const hasSeenTour = localStorage.getItem('sims_has_seen_tour');
    if (!hasSeenTour) {
      // Add a slight delay so the UI can render fully
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('sims_has_seen_tour', 'true');
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-lg font-bold mb-2">Welcome to SIMS! 👋</h2>
          <p className="text-sm">Let's take a quick tour to help you master your new inventory system.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.tour-sidebar',
      content: 'Navigate between your Dashboard, Inventory items, Locations, and Settings from here.',
      placement: 'right',
    },
    {
      target: '.tour-notifications',
      content: 'Keep an eye on this bell! It will instantly alert you about low stock or expiring items.',
      placement: 'bottom',
    },
    {
      target: '.tour-stats',
      content: 'Your Dashboard gives you a bird\'s-eye view of your entire warehouse health at a glance.',
      placement: 'bottom',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideCallback}
      options={{
        primaryColor: '#3b82f6', // Tailwind blue-500
        zIndex: 10000,
        showProgress: true,
      }}
      styles={{
        tooltip: {
          borderRadius: '12px',
          fontFamily: 'inherit',
          padding: '24px',
        },
        buttonPrimary: {
          fontWeight: 'bold',
          borderRadius: '8px',
        },
        buttonBack: {
          marginRight: '8px',
        },
      }}
    />
  );
}
