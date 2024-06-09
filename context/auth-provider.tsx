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
import React from "react";

// Define your types here or import them if they're in a separate file

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
  user?: Profile;
  roles: string[];
  loading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Profile | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      const { jti, groups } = parseJwt(token);

      apiClient.get(`/profile/get-by-user/${jti}`)
        .then((res) => res.data)
        .then((data) => {
          const profile: Profile = {
            userId: jti,
            profileId: data.id,
            orgId: data.organisation.id,
            profilePicture: '',
            username: data.name,
            email: data.email,
            mobile: data.mobile,
            departmentId: data.department?.id,
          };
          setUser(profile);
          setRoles(groups);
        })
        .catch((e) => {
          console.log(e);
          signOut();
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false after the request completes
        });
    } else {
      setIsLoading(false); // Also set loading to false if there's no token
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    setIsLoading(true); // Start loading when sign-in begins
    try {
      const response = await apiClient.post('/auth/authenticate', {
        email,
        password,
      });

      const { token, refreshToken, expiry } = response.data;
      saveTokensOnCookies(token, refreshToken, expiry);

      apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;

      const { jti, groups } = parseJwt(token);

      const profileResponse = await apiClient.get(`/profile/get-by-user/${jti}`);
      const data = profileResponse.data;

      const profile: Profile = {
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
      toast.success('Welcome');
      router.push('/dashboard'); // Redirect to dashboard after successful sign-in
    } catch (err) {
      toast.error('Failed to sign in. Please check your credentials.');
      console.error('Sign-in error:', err);
    } finally {
      setIsLoading(false); // End loading when sign-in completes or fails
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
    setRoles([]);
    setIsLoading(false); // Reset loading state
    // Clear tokens and navigate to login or home page
    // e.g., clearTokens(); router.push('/login');
  }, []);

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center bg-background z-40">
        <Loader className="animate-spin h-5 w-5 mr-3" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, roles, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};