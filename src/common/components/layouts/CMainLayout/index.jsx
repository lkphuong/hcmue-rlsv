import React from "react";

import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { ROUTES } from "_constants/routes";

import "./index.scss";

export const CMainLayout = () => {
  const profile = useSelector((state) => state.auth.profile);

  return profile ? (
    <div>CMainLayout</div>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace={true} />
  );
};
