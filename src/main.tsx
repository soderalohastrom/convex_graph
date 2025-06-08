import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode data-oid="ujec.9r">
    <ConvexAuthProvider client={convex} data-oid="49hrmkt">
      <App data-oid="q35_c0f" />
    </ConvexAuthProvider>
  </StrictMode>,
);
