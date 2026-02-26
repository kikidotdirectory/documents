import path from "node:path";
import * as sass from "sass";

export default async function (eleventyConfig) {
  // enable smart quotes
  eleventyConfig.amendLibrary("md", function (md) {
    md.set({
      typographer: true,
    });
  });

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      // Don’t compile file names that start with an underscore
      if (parsed.name.startsWith("_")) {
        return;
      }

      const compiled = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
      });

      // Map dependencies for incremental builds
      this.addDependencies(inputPath, compiled.loadedUrls);

      return async (data) => {
        return compiled.css;
      };
    },
  });
  eleventyConfig.addTemplateFormats("scss");

  eleventyConfig.addCollection("writings", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/writings/**/*.md");
  });
}

export const config = {
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dir: {
    input: "src",
    includes: "../_includes",
    layouts: "../_includes/layouts",
    data: "../_data",
    output: "_site",
  },
};
