import { Navigate, createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { NotFound } from "../pages/404";
import { Multimodal } from "../pages/Mutilmodal";
import { SurvivalPrediction } from "../pages/SurvivalPrediction";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "mutilmodal",
        element: <Multimodal></Multimodal>
      },
      {
        path: "survival_prediction",
        element: <SurvivalPrediction></SurvivalPrediction>
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" />
  }
]);

export default router;
