import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    base: "",
    plugins: [react(), svgr()],
  });
};
