// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import defaultAxios from "../utils/DefaultAxios";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  role_id: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  login: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await defaultAxios.get("http://127.0.0.1:8000/api/v1/me");
      setAuthUser(res.data.user);
    } catch (err) {
      localStorage.removeItem("access_token");
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
