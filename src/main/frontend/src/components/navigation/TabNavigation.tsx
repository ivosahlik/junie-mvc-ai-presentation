import type { ReactNode, ComponentType } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: string | number;
  icon?: ComponentType<{ className?: string }>;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * Tab navigation component for organizing content
 * Supports different visual variants and tab states
 */
const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default',
}: TabNavigationProps) => {
  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses =
      'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors';

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-md ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;

      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;

      default:
        return `${baseClasses} border border-gray-200 ${
          isActive
            ? 'bg-white text-gray-900 border-gray-300'
            : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
    }
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'pills':
        return 'flex gap-1 p-1 bg-gray-100 rounded-lg';
      case 'underline':
        return 'flex border-b border-gray-200';
      default:
        return 'flex bg-gray-50 rounded-lg p-1';
    }
  };

  const handleTabClick = (tab: Tab) => {
    if (!tab.disabled) {
      onTabChange(tab.id);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={getContainerClasses()}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              disabled={tab.disabled}
              className={getTabClasses(tab, isActive)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-4"
      >
        {activeTabContent}
      </div>
    </div>
  );
};

export default TabNavigation;
