export default async function (eleventyConfig) {
  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/",
    })
    .addPassthroughCopy("**/*.png");

  // enable smart quotes
  eleventyConfig.amendLibrary("md", function (md) {
    md.set({
      typographer: true,
    });
  });

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
