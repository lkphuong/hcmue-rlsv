import { ROUTES } from "_constants/routes";

import { CLoginLayout, CMainLayout } from "_layouts/";

export const browserRouter = [
  {
    path: ROUTES.HOME,
    element: <CMainLayout />,
  },
  {
    path: ROUTES.LOGIN,
    element: <CLoginLayout />,
  },
];
