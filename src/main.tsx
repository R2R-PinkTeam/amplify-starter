import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import App from "./App.tsx";
import Setup from "./Setup.tsx";
import Presentation from "./Presentation.tsx";
import LandingPage from "./components/LandingPage.tsx";
import AuthPage from "./components/AuthPage.tsx";
import Dashboard from "./components/Dashboard.tsx";
import MyDesigns from "./components/MyDesigns.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode temporarily disabled for hackathon - causes double mounting in dev
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/presentation" element={<Presentation />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <Authenticator>
              <Dashboard />
            </Authenticator>
          }
        />
        <Route
          path="/my-designs"
          element={
            <Authenticator>
              <MyDesigns />
            </Authenticator>
          }
        />
        <Route
          path="/app"
          element={
            <Authenticator>
              <App />
            </Authenticator>
          }
        />
        <Route
          path="/setup"
          element={
            <Authenticator>
              <Setup />
            </Authenticator>
          }
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
);
