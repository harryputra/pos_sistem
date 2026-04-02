"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Branch, UMKM } from "@/lib/types";
import { mockUsers, mockBranches, mockUMKM, DEMO_ACCOUNTS } from "@/lib/mock-data";

interface AuthState {
    user: User | null;
    umkm: UMKM | null;
    currentBranch: Branch | null;
    availableBranches: Branch[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    switchBranch: (branchId: string) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            umkm: null,
            currentBranch: null,
            availableBranches: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                await new Promise((r) => setTimeout(r, 800));

                const account = DEMO_ACCOUNTS.find(
                    (a) => a.email === email && a.password === password
                );

                if (!account) {
                    set({ isLoading: false, error: "Email atau password salah" });
                    return false;
                }

                const user = mockUsers.find((u) => u.email === email) || null;
                let branches: Branch[] = [];

                if (account.role === "owner") {
                    branches = mockBranches.filter((b) => b.umkmId === "umkm-001");
                } else if (user?.branchId) {
                    branches = mockBranches.filter((b) => b.id === user.branchId);
                }

                const currentBranch = branches[0] || null;

                set({
                    user,
                    umkm: mockUMKM,
                    currentBranch,
                    availableBranches: branches,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return true;
            },

            logout: () => {
                set({
                    user: null,
                    umkm: null,
                    currentBranch: null,
                    availableBranches: [],
                    isAuthenticated: false,
                    error: null,
                });
            },

            switchBranch: (branchId: string) => {
                const branch = get().availableBranches.find((b) => b.id === branchId);
                if (branch) set({ currentBranch: branch });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "pos-auth",
            partialize: (state) => ({
                user: state.user,
                umkm: state.umkm,
                currentBranch: state.currentBranch,
                availableBranches: state.availableBranches,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
