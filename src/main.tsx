import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import App from "./App.tsx";
import Setup from "./Setup.tsx";
import Presentation from "./Presentation.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Presentation is public - no auth required */}
        <Route path="/presentation" element={<Presentation />} />
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <Authenticator>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/setup" element={<Setup />} />
              </Routes>
            </Authenticator>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
