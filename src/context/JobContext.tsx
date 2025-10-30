/**
 * Ish e'lonlari Context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

import { getJobs, getUserJobs } from '../services/jobService';
import { FilterOptions, Job } from '../types';

import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  userJobs: Job[];
  loading: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  refreshJobs: () => Promise<void>;
  refreshUserJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { user } = useAuth();

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const fetchedJobs = await getJobs(filters);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserJobs = async () => {
    if (!user) {
      setUserJobs([]);
      return;
    }

    setLoading(true);
    try {
      const fetchedJobs = await getUserJobs(user.id);
      setUserJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (user) {
      refreshUserJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        userJobs,
        loading,
        filters,
        setFilters,
        refreshJobs,
        refreshUserJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

