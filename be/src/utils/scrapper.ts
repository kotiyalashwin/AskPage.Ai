import axios from "axios";

import * as cheerio from "cheerio";

interface ScrapedContent {
  title: string;
  description: string;
  headings: string[];
  mainText: string;
  fullText: string;
}

// Helper function to check if page requires authentication
const checkForAuth = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data as string);
    const title = $("title").text().toLowerCase();
    const authIndicators = [
      "login",
      "signup",
      "signin",
      "authenticate",
      "auth",
    ];

    return authIndicators.some((indicator) => title.includes(indicator));
  } catch (error) {
    return true;
  }
};

// Helper function to clean and normalize text
const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[\n\t]/g, " ") // Replace newlines and tabs with spaces
    .replace(/[^\w\s.,!?;:'"-]/g, "") // Remove special characters except basic punctuation
    .trim();
};

export async function getWebpageContentForLLM(url: string): Promise<string> {
  try {
    // Validate URL format
    if (!url.match(/^https?:\/\//i)) {
      throw new Error("Invalid URL format");
    }

    // const authRequired = await checkForAuth(url);
    // if (authRequired) {
    //   throw new Error("Authentication required");
    // }

    const response = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      responseType: "text",
    });

    // Load HTML into cheerio
    // @ts-ignore
    const $ = cheerio.load(response.data);

    // Check for these elements in order of priority
    const selectors = [
      "main", // HTML5 <main> element
      "div#main", // Div with id="main"
      '[role="main"]', // ARIA role="main"
      "body", // Fallback to entire body
    ];

    let mainContent = null;
    // Find the first matching element
    for (const selector of selectors) {
      mainContent = $(selector).first();
      if (mainContent.length > 0) {
        console.log(`Found content using selector: ${selector}`);
        break;
      }
    }

    // If no content found (shouldn't happen with body fallback)
    if (!mainContent || mainContent.length === 0) {
      throw new Error("No main content element found");
    }

    // Elements to remove (extend as needed)
    const elementsToRemove = [
      "script",
      "style",
      "noscript",
      "iframe",
      "img",
      "svg",
      "figure",
      "form",
      "header",
      "footer",
      "nav",
      "aside",
      "link",
      "meta",
      "button",
      "input",
    ];

    // Remove non-text elements
    mainContent.find(elementsToRemove.join(",")).remove();

    // Get all text content
    let textContent = mainContent.text();

    // Clean up the text
    textContent = textContent
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/\n+/g, "\n") // Collapse multiple newlines
      .replace(/^\s+|\s+$/g, "") // Trim each line
      .trim();

    return textContent;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error scraping ${url}:`, errorMessage);
    return "Unable to retrieve content from this page";
  }
}
