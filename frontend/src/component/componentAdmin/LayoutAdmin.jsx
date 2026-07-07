import React from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./SidebarMenu.jsx";
import Breadcrumb from "./Breadcrumb.jsx";
import Footer from "./footer.jsx";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const LayoutAdmin = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-right" />

      <div className="primaryBgColor accentTextColor hidden lg:block fixed left-0 top-0 h-screen w-65 z-30 border-r border-white/10 overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
        </div>
        <SidebarMenu />
      </div>

      <div className="lg:ml-65 flex flex-col min-h-screen">
        <Breadcrumb />

        <main className="flex-1 p-2 lg:p-2">
          <TooltipProvider><Outlet /></TooltipProvider>
        </main>

        <footer className="primaryBgColor accentTextColor">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default LayoutAdmin;
