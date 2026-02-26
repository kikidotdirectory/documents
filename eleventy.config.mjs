import { RenderPlugin } from "@11ty/eleventy";

export default async function (eleventyConfig) {
	// enable smart quotes
	eleventyConfig.amendLibrary("md", function (md) {
		md.set({
			typographer: true,
		});
	});

	// Enable plugins
	eleventyConfig.addPlugin(RenderPlugin);

	// Enable CSS bundling
	eleventyConfig.addBundle("css");

	eleventyConfig.addCollection("writings", function (collectionApi) {
		return collectionApi.getFilteredByGlob("src/writings/**/*.md");
	});
}

export const config = {
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "src",
		includes: "_includes",
		layouts: "_includes/layouts",
		data: "_data",
		output: "_site",
	},
};
