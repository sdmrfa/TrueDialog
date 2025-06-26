// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TrueDialogChat from "../components/TrueDialogChat";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TrueDialogChat />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
