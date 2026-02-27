import { RenderPlugin } from "@11ty/eleventy";

import fs from "node:fs/promises";
import path from "node:path";

import postcss from "postcss";
import postcssImportExtGlob from "postcss-import-ext-glob";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";

export default async function (eleventyConfig) {
	eleventyConfig.on("eleventy.before", async () => {
		const inputPath = "src/css/global.css";
		const outputPath = "dist/css/global.css";
		const inputContent = await fs.readFile(inputPath, "utf-8");
		const result = await postcss([
			postcssImportExtGlob,
			postcssImport,
			tailwindcss,
		]).process(inputContent, { from: inputPath });

		await fs.mkdir(path.dirname(outputPath), { recursive: true });
		await fs.writeFile(outputPath, result.css);
	});

	// enable smart quotes
	eleventyConfig.amendLibrary("md", function (md) {
		md.set({
			typographer: true,
		});
	});

	// Enable plugins
	eleventyConfig.addPlugin(RenderPlugin);

	eleventyConfig.addCollection("writings", function (collectionApi) {
		return collectionApi.getFilteredByGlob("src/writings/**/*.md");
	});

	// custom filters
	eleventyConfig.addFilter("shortDate", (str) => {
		const date = new Date(str);

		return date.toLocaleDateString("en-US", {
			month: "2-digit",
			year: "numeric",
		});
	});
}

export const config = {
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "src",
		output: "dist",
	},
};
