import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const Setup = lazy(() => import("./pages/Setup"));
const Gallery = lazy(() => import("./pages/Gallery"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Setup />,
  },
  {
    path: "/:id",
    element: <Gallery />,
  },
]);

export default function Route() {
  return <RouterProvider router={router} />;
}
