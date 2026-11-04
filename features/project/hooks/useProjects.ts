'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError, projectApi } from '../api/projectApi';
import { PaginationMeta, Project, ProjectPayload } from '../types';

export function useProjects(initialPage: number = 1) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getProjects(page);
      setProjects(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch projects');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (payload: ProjectPayload) => {
    const res = await projectApi.createProject(payload);
    await fetchProjects();
    return res.data;
  };

  const updateProject = async (id: number, payload: Partial<ProjectPayload>) => {
    const res = await projectApi.updateProject(id, payload);
    await fetchProjects();
    return res.data;
  };

  const deleteProject = async (id: number) => {
    await projectApi.deleteProject(id);
    await fetchProjects();
  };

  return {
    projects,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}

