/** Single source of truth for the backend base URL and routes. */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL as string;

export const API_ROUTES = {
  auth: {
    signUp: "/auth/signup",
    signIn: "/auth/signin",
  },
  users: {
    me: "/users/me",
  },
} as const;
