import React from "react";

import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { ROUTES } from "_constants/routes";

import { LoginPage } from "_modules/auth/pages";

export const CLoginLayout = () => {
  const profile = useSelector((state) => state.auth.profile);

  return profile ? <Navigate to={ROUTES.HOME} replace={true} /> : <LoginPage />;
};
