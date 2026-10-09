/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  myRole: string; // The user's role in this org
}

interface WorkspaceState {
  activeOrganizationId: string | null;
  organizations: Organization[];
  
  setActiveOrganizationId: (id: string | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeOrganizationId: null,
      organizations: [],

      setActiveOrganizationId: (id) => set({ activeOrganizationId: id }),
      setOrganizations: (orgs) => set({ organizations: orgs }),
      clearWorkspace: () => set({ activeOrganizationId: null, organizations: [] }),
    }),
    {
      name: 'taskflow-workspace-storage', // unique name for localStorage key
    }
  )
);
