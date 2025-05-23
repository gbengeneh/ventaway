import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import AuthGate from "@/components/AuthGate";
import MainLayout from "./mainLayout"; // move MainLayout to a separate file or inline it here

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <AuthGate>
            <MainLayout />
          </AuthGate>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
