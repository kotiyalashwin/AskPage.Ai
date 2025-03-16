import axios from "axios";
import * as cheerio from "cheerio";

const checkForAuth = async (url: string) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data as string);

    if (
      $("title").text().toLowerCase().includes("login") ||
      $("title").text().toLowerCase().includes("signup") ||
      $("title").text().toLowerCase().includes("signin")
    ) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
};

export async function getWebpageContentForLLM(url: string) {
  try {
    const authRequired = await checkForAuth(url);

    if (authRequired) {
      throw new Error();
    }
    const response = await axios.get(url);
    const $ = cheerio.load(response.data as string);

    let mainContent = $(
      "main, article, .content, .article, .post, .main-content, .page-content, #content, #article, #main-content"
    );

    if (mainContent.length === 0) {
      // Fallback: Remove common non-content elements
      mainContent = $("body")
        .clone()
        .find(
          "nav, footer, aside, header, script, style, form, button, input, iframe, video, audio, picture, svg"
        )
        .remove();
    }

    if (mainContent.length === 0) {
      // Fallback: find the div that contains the most paragraphs.
      let maxParagraphs = 0;
      let maxParagraphDiv = $("body");
      $("div").each((index, element) => {
        const paragraphCount = $(element).find("p").length;
        if (paragraphCount > maxParagraphs) {
          maxParagraphs = paragraphCount;
          maxParagraphDiv = $(element);
        }
      });
      mainContent = maxParagraphDiv;
    }

    const pageText = mainContent.text().replace(/\s+/g, " ").trim();
    return pageText;
  } catch (error) {
    // console.error("Error fetching or parsing the page:", error);
    return "Privacy policy restricts this Page to be scrapped";
  }
}
