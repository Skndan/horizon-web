import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { saveTokensOnCookies } from "../utils/save-cookies";
import { AuthTokenError } from "@/service/auth-token-error";
import { signOut } from "../utils/sign-out";

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess(token: string): void;
  onFailure(err: AxiosError): void;
}[] = [];

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<{ code?: string }>) => {
      if (error.response?.status === 401) {
        if (error.response.data?.code === "token.expired") {
          cookies = parseCookies(ctx);
          const originalConfig = { ...error.config };

          if (!isRefreshing) {
            isRefreshing = true;

            const { "nextauth.refreshToken": refreshToken } = cookies;

            api
              .post("/refresh", { refreshToken })
              .then((response) => {
                const { token, refreshToken, expiry } = response.data;

                saveTokensOnCookies(token, refreshToken, expiry, ctx);

                // @ts-ignore
                api.defaults.headers["Authorization"] = `Bearer ${token}`;

                failedRequestsQueue.forEach((req) => req.onSuccess(token));
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(err)
                );

                if (typeof window) {
                  signOut(ctx);
                }
              })
              .finally(() => {
                failedRequestsQueue = [];
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                // @ts-ignore
                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (typeof window) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    }
  );

  // Interceptor for request
  api.interceptors.request.use(
    async (config) => { 
      let token = cookies["nextauth.token"];
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
}