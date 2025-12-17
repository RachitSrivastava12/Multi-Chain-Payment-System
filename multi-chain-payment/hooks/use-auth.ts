"use client"

import { create } from "zustand"

interface AuthState {
  token: string | null
  email: string | null
  username: string | null

  login: (data: { token: string; email: string; username: string }) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  email: null,
  username: null,

  login: ({ token, email, username }) =>
    set({ token, email, username }),

  logout: () =>
    set({ token: null, email: null, username: null }),
}))
