import { usePageTracking } from '@/hooks/usePageTracking';

/**
 * Component that tracks page views automatically
 * Should be placed inside the router context
 */
export const PageTracker: React.FC = () => {
  usePageTracking();
  return null;
};
