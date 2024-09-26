import { GetServerSidePropsContext } from "next";
import Router from "next/router";
import { destroyCookie } from "nookies";

export function clearCache(ctx?: GetServerSidePropsContext) {
  destroyCookie(ctx, "nextauth.token");
  destroyCookie(ctx, "nextauth.refreshToken"); 
}