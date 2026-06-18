import React from "react";
import SidebarMenu from "./SidebarMenu.jsx";
import Footer from "./footer.jsx";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const LayoutAdmin = ({ children, breadcrumbData }) => {
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
        <main className="flex-1">
          <TooltipProvider>
            <div className="p-3 lg:p-6">{children}</div>
          </TooltipProvider>
        </main>

        <footer className="border-t border-muted-foreground/10 bg-white">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default LayoutAdmin;
