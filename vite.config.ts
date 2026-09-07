import { fileURLToPath, URL } from "node:url";

const removeAnalytics = (html: string) =>
  html
    .replace(/<script async src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>\s*/, "")
    .replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>\s*/, "");

const dravakhBranding = {
  name: "dravakh-branding",
  transformIndexHtml: (html: string) => ({
    html: removeAnalytics(html)
      .replace(/<title>[^<]*<\/title>/, "<title>Dravakh Map Studio</title>")
      .replace(
        /<meta name="application-name" content="[^"]*"\s*\/>/,
        '<meta name="application-name" content="Dravakh Map Studio" />'
      )
      .replace(
        /<meta name="description"\s+content="[^"]*"\s*\/>/,
        '<meta name="description" content="Project-controlled cartography studio for Dravakh: House of Habits, derived from Azgaar\'s Fantasy Map Generator." />'
      )
      .replace(
        /<meta property="og:url" content="[^"]*"\s*\/>/,
        '<meta property="og:url" content="https://rafasms93-dot.github.io/dravakh-map-studio/" />'
      )
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, '<meta property="og:title" content="Dravakh Map Studio" />')
      .replace(
        /<meta property="twitter:url" content="[^"]*"\s*\/>/,
        '<meta property="twitter:url" content="https://rafasms93-dot.github.io/dravakh-map-studio/" />'
      )
      .replace(
        /<meta name="twitter:title" content="[^"]*"\s*\/>/,
        '<meta name="twitter:title" content="Dravakh Map Studio" />'
      )
      .replace(
        /<link rel="canonical" href="[^"]*"\s*\/>/,
        '<link rel="canonical" href="https://rafasms93-dot.github.io/dravakh-map-studio/" />'
      ),
    tags: [{ tag: "script", attrs: { type: "module", src: "/dravakh/runtime.ts" }, injectTo: "head" as const }]
  })
};

const stripPwaForElectron = {
  name: "strip-pwa-for-electron",
  transformIndexHtml: (html: string) => html.replace(/<link rel="manifest"[^>]*>\s*/, "")
};

export default ({ mode }: { mode: string }) => ({
  root: "./src",
  base: mode === "electron" ? "./" : process.env.NETLIFY ? "/" : "/dravakh-map-studio/",
  plugins: mode === "electron" ? [dravakhBranding, stripPwaForElectron] : [dravakhBranding],
  build: {
    outDir: mode === "electron" ? "../dist-electron/renderer" : "../dist",
    assetsDir: "./",
    emptyOutDir: mode === "electron"
  },
  publicDir: "../public",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
