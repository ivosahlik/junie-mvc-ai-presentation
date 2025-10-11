import { useState, useCallback } from 'react';

export interface UseTabsOptions {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * Custom hook for managing tab state
 * Provides state management and handlers for tab navigation
 */
export const useTabs = (tabIds: string[], options: UseTabsOptions = {}) => {
  const { defaultTab = tabIds[0], onTabChange } = options;

  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const changeTab = useCallback(
    (tabId: string) => {
      if (tabIds.includes(tabId)) {
        setActiveTab(tabId);
        onTabChange?.(tabId);
      }
    },
    [tabIds, onTabChange]
  );

  const nextTab = useCallback(() => {
    const currentIndex = tabIds.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabIds.length;
    changeTab(tabIds[nextIndex]);
  }, [tabIds, activeTab, changeTab]);

  const previousTab = useCallback(() => {
    const currentIndex = tabIds.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabIds.length - 1 : currentIndex - 1;
    changeTab(tabIds[prevIndex]);
  }, [tabIds, activeTab, changeTab]);

  const isFirstTab = activeTab === tabIds[0];
  const isLastTab = activeTab === tabIds[tabIds.length - 1];
  const currentIndex = tabIds.indexOf(activeTab);

  return {
    activeTab,
    changeTab,
    nextTab,
    previousTab,
    isFirstTab,
    isLastTab,
    currentIndex,
    totalTabs: tabIds.length,
  };
};

export default useTabs;
