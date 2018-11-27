import { uglify } from "rollup-plugin-uglify";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/main.ts",
    output: {
        file: process.env.BUILD === 'production' ? "dist/export-course-table.min.js" : "dist/export-course-table.js",
        format: "iife"
    },
    plugins: [
        typescript(),
        process.env.BUILD === 'production' && uglify()
    ]
}
