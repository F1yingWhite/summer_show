import { Navigate, createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { NotFound } from "../pages/404";
import { WSIPrediction } from "../pages/WSIPrediction";
import { SurvivalPrediction } from "../pages/SurvivalPrediction";
import DicomPrediction from "../pages/DicomPrediction";
import Mutilmodal from "../pages/MutilModal";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "wsi_prediction",
        element: <WSIPrediction></WSIPrediction>
      },
      {
        path: "survival_prediction",
        element: <SurvivalPrediction></SurvivalPrediction>
      },
      {
        path: "wsi_prediction",
        element: <WSIPrediction></WSIPrediction>
      },
      {
        path: "mutilmodal",
        element: <Mutilmodal></Mutilmodal>
      },
      {
        path: "dicom_prediction",
        element: <DicomPrediction></DicomPrediction>
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
