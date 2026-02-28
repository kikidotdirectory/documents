import { RenderPlugin } from "@11ty/eleventy";

import { buildAllCss } from "./src/_config/build-css.js";
export default async function (eleventyConfig) {
	eleventyConfig.on("eleventy.before", async () => {
		await buildAllCss();
	});
	// custom watch targets
	eleventyConfig.addWatchTarget("./src/css/**/*.css");

	// enable smart quotes
	eleventyConfig.amendLibrary("md", function (md) {
		md.set({
			typographer: true,
		});
	});

	// Enable plugins
	eleventyConfig.addPlugin(RenderPlugin);

	eleventyConfig.addBundle("css", { hoist: true });

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
		includes: "_includes",
	},
};
