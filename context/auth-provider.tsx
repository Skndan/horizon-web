"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import apiClient, { parseJwt } from "@/lib/api/api-client";
import { signOut } from "@/lib/utils/sign-out";
import { saveTokensOnCookies } from "@/lib/utils/save-cookies";
import toast from "react-hot-toast";
import { Profile } from "@/store/use-user-store";
import { Loader } from "lucide-react";

// type User = {
//   email: string;
//   permissions: string[];
//   roles: string[];
// };

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(data: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  roles: string[];
  user?: Profile;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Profile>();
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      const { jti, groups } = parseJwt(token);

      apiClient.get(`/profile/get-by-user/${jti}`)
        .then((res) => res.data)
        .then(async (data) => {
          var profile: Profile = {
            userId: jti,
            profileId: data.id,
            orgId: data.organisation.id,
            profilePicture: '',
            username: data.name,
            email: data.email,
            mobile: data.mobile,
          };
          setUser(profile);
          setRoles(groups);
          toast.success("Welcome");
          // No need to push to "/dashboard" here if you're already handling it in signIn
        }).catch(() => {
          signOut();
        }).finally(() => {
          setIsLoading(false); // Set loading to false after the request completes
        });
    } else {
      setIsLoading(false); // Also set loading to false if there's no token
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    // your signIn logic
    // Make sure to set `isLoading` to `false` once signIn process is completed or failed

    try {
      const response = await apiClient.post("/auth/authenticate", {
        email,
        password,
      });
  
      const { token, refreshToken, expiry } = response.data;

      saveTokensOnCookies(token, refreshToken, expiry);

      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      const { jti, groups } = parseJwt(token);

      await apiClient.get(`/profile/get-by-user/${jti}`)
        .then((res) => res.data)
        .then(async (data) => {
          var profile: Profile = {
            userId: jti,
            profileId: data.id,
            orgId: data.organisation.id,
            profilePicture: '',
            username: data.name,
            email: data.email,
            mobile: data.mobile,
          };

          setUser(profile);
          setRoles(groups);

          toast.success("Welcome");
          router.push("/dashboard");
        }).catch(() => {
          signOut();
        });
      router.push("/dashboard");
    } catch (err) { 
    } finally {
      setIsLoading(false); // Set loading to false after the request completes 
    }
  }, []);

  if (isLoading) {
    return <div className="grid h-screen place-items-center bg-background z-40">
      <Loader className="animate-spin h-5 w-5 mr-3" />
    </div>
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, roles, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}