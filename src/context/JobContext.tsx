/**
 * Ish e'lonlari Context
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getRecommendedJobs } from '../data/homeData';
import { getJobs, getUserJobs } from '../services/jobService';
import { FilterOptions, Job } from '../types';

import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  userJobs: Job[];
  filteredJobs: Job[];
  recommendedJobs: Job[];
  loading: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  applyFilters: (newFilters: FilterOptions) => void;
  getJobsByCategory: (categoryId: string) => Job[];
  getJobsByCompany: (companyName: string) => Job[];
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
  const [viewedCategories, setViewedCategories] = useState<string[]>([]);
  const { user } = useAuth();

  // Filtrlangan ishlar
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (filters.region) {
      filtered = filtered.filter((job) => job.region === filters.region);
    }

    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }

    if (filters.employmentType) {
      filtered = filtered.filter(
        (job) => job.employmentType === filters.employmentType,
      );
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(
        (job) =>
          job.salary &&
          job.salary.min &&
          job.salary.min >= (filters.salaryMin || 0),
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.companyName?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [jobs, filters]);

  // Tavsiya etilgan ishlar
  const recommendedJobs = useMemo(() => {
    return getRecommendedJobs(user?.id, jobs, viewedCategories);
  }, [user, jobs, viewedCategories]);

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const fetchedJobs = await getJobs(filters);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Xatolik bo'lsa ham bo'sh array qaytarish
      setJobs([]);
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

  // Filtrlarni qo'llash
  const applyFilters = (newFilters: FilterOptions) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Kategoriya bo'yicha ishlarni olish
  const getJobsByCategory = (categoryId: string): Job[] => {
    // Kategoriyani ko'rilganlar ro'yxatiga qo'shish
    if (!viewedCategories.includes(categoryId)) {
      setViewedCategories((prev) => [...prev, categoryId]);
    }
    return jobs.filter((job) => job.category === categoryId);
  };

  // Kompaniya bo'yicha ishlarni olish
  const getJobsByCompany = (companyName: string): Job[] => {
    return jobs.filter(
      (job) => job.companyName?.toLowerCase() === companyName.toLowerCase(),
    );
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        userJobs,
        filteredJobs,
        recommendedJobs,
        loading,
        filters,
        setFilters,
        applyFilters,
        getJobsByCategory,
        getJobsByCompany,
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
