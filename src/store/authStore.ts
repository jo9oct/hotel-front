import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Configure API and Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_BASE_BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

// ✅ Types
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  setTotalUsers: number | 0
  setVerifiedUsersCount: number | 0

  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;


  login: (username: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
}

// ✅ Zustand Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      adminLog : null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true,
      error: null,
      setTotalUsers: 0,
      setVerifiedUsersCount: 0,

       // ✅ Setters for Google login
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

      // ✅ Login
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/Login`, {
            username,
            password,
          }, { withCredentials: true });
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          } else {
            throw new Error("Login failed");
          }
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Check Auth
      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/checkAuth`, {
            withCredentials: true 
          });
      
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      // ✅ Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_BASE_URL}/auth/Logout`);
          set({ user: null, isAuthenticated: false });
          toast.success("Logged out");
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Update Profile
      updateProfile: async ({ currentPassword, newPassword }) => {
        set({ isLoading: true, error: null });
      
        try {
          const res = await axios.put(`${API_BASE_URL}/auth/update-profile`, {
            currentPassword,
            newPassword,
          }, { withCredentials: true }); // include cookies if JWT is in cookies

          set({ user: res.data.user });
          
        } catch (err: any) {
          // axios error handling
          const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Update failed";
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      }      

    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ✅ Error handler
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Network error";
  }
  if (error instanceof Error) return error.message;
  return "Unknown error occurred";
}
