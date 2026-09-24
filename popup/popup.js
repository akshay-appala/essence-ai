// Get elements from the HTML
const summaryMode = document.getElementById("summaryMode");
const summarizeButton = document.getElementById("summarizeButton");
const copyButton = document.getElementById("copyButton");
const statusMessage = document.getElementById("statusMessage");
const summaryOutput = document.getElementById("summaryOutput");

// Extract article text from the webpage
function getArticleText() {
  // Try common selectors for the main article content
  const selectors = [
    "article",
    "main",
    ".article-content",
    ".post-content",
    ".entry-content",
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);

    if (element && element.innerText.trim().length > 200) {
      return element.innerText.trim();
    }
  }

  // Fallback: collect paragraphs with meaningful text
  const paragraphs = Array.from(document.querySelectorAll("p"));

  const text = paragraphs
    .map((p) => p.innerText.trim())
    .filter((text) => text.length > 40)
    .join("\n");

  return text;
}
// Extract text from the active webpage
// Extract and prepare webpage content
async function getPageContent() {
  // Find the active tab
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab || !tab.id) {
    throw new Error("No active tab found.");
  }

  // Extract article text from the webpage
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getArticleText,
  });

  // Get the extracted text
  const pageContent = results[0]?.result;

  // Check whether text was extracted
  if (!pageContent || !pageContent.trim()) {
    throw new Error("No readable article text found.");
  }

  // Clean up unnecessary whitespace
  const cleanedContent = pageContent.replace(/\s+/g, " ").trim();

  // Limit the text length
  const maxLength = 20000;
  const limitedContent = cleanedContent.slice(0, maxLength);

  return limitedContent;
}

// Summarize button click event
summarizeButton.addEventListener("click", async function () {
  try {
    statusMessage.textContent = "Reading webpage...";
    summarizeButton.disabled = true;

    // Get the webpage text
    const pageContent = await getPageContent();
    console.log("Extracted article length:", pageContent.length);

    // Check whether the page contains text
    if (!pageContent.trim()) {
      throw new Error("No readable text found on this page.");
    }

    // Display the extracted text for testing
    summaryOutput.textContent = pageContent;

    statusMessage.textContent = "Webpage text extracted successfully.";

    // Enable the Copy button
    copyButton.disabled = false;
  } catch (error) {
    statusMessage.textContent = error.message || "Unable to read this webpage.";

    console.error("Page extraction failed:", error);
  } finally {
    summarizeButton.disabled = false;
  }
});

// Copy button click event
copyButton.addEventListener("click", async function () {
  const summary = summaryOutput.textContent;

  try {
    await navigator.clipboard.writeText(summary);
    statusMessage.textContent = "Text copied to clipboard.";
  } catch (error) {
    statusMessage.textContent = "Unable to copy the text.";
    console.error("Copy failed:", error);
  }
});
