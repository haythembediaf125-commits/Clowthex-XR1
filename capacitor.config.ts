import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // ── App identity ──────────────────────────────────────────────────────────
  appId: "com.haythemgroup.stockmanager",
  appName: "Style Stock Manager",

  // ── Web source ────────────────────────────────────────────────────────────
  // Points to the Vite build output
  webDir: "dist",

  // ── Android-specific ──────────────────────────────────────────────────────
  android: {
    // Allow cleartext only for localhost (dev mode); production stays HTTPS
    allowMixedContent: false,
    // Enable hardware back button handling
    captureInput: true,
    // Optimise WebView
    webContentsDebuggingEnabled: false,
  },

  // ── Plugins ───────────────────────────────────────────────────────────────
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,        // We hide it manually after app init
      backgroundColor: "#0f0f0f",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0f0f0f",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },

  // ── Server (dev only — remove for production builds) ─────────────────────
  // server: {
  //   url: "http://YOUR_LOCAL_IP:5173",
  //   cleartext: true,
  // },
};

export default config;
