import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/algoverse.es.js",
      format: "esm"
    },
    {
      file: "dist/algoverse.cjs.js",
      format: "cjs"
    },
    {
      file: "dist/algoverse.umd.js",
      format: "umd",
      name: "AlgoVerse",
      plugins: [terser()]
    }
  ],
  plugins: [resolve(), commonjs()]
};
