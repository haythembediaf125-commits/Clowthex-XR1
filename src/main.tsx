import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { ActivationScreen } from "@/components/ActivationScreen";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import "@/styles.css";

// ─── Capacitor setup ──────────────────────────────────────────────────────────
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0f0f0f" });
  } catch {
    // StatusBar might not be available on all devices
  }
  // Hide splash screen after the app is ready
  await SplashScreen.hide({ fadeOutDuration: 300 });
}

// ─── Query client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data for 24 hours — works offline
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// ─── App content ──────────────────────────────────────────────────────────────
function AppContent() {
  const { isReady } = useApp();
  const [activated, setActivated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("wipe") === "1") {
      try {
        localStorage.clear();
        sessionStorage.clear();
        indexedDB.deleteDatabase("style-stock-manager");
      } catch {
        /* ignore */
      }
      return false;
    }
    if (params.get("reset") === "1") {
      localStorage.removeItem("ssm_activated");
      return false;
    }
    return localStorage.getItem("ssm_activated") === "1";
  });

  useEffect(() => {
    document.title = "Style Stock Manager - إدارة محل الملابس";
    initCapacitor();
  }, []);

  if (!isReady) return <div className="min-h-screen bg-background" />;
  if (!activated) return <ActivationScreen onActivated={() => setActivated(true)} />;
  return <AppShell />;
}

// ─── Root render ──────────────────────────────────────────────────────────────
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Sonner position="top-center" richColors />
          <AppContent />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
);
