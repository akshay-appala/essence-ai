// Get elements from the HTML
const summaryMode = document.getElementById("summaryMode");
const summarizeButton = document.getElementById("summarizeButton");
const copyButton = document.getElementById("copyButton");
const statusMessage = document.getElementById("statusMessage");
const summaryOutput = document.getElementById("summaryOutput");

// Summarize button click event
summarizeButton.addEventListener("click", function () {
  const selectedMode = summaryMode.value;

  let summary = "";

  // Temporary summaries for testing
  if (selectedMode === "brief") {
    summary = "This is a brief summary of the article.";
  } else if (selectedMode === "bullets") {
    summary = "• First key point\n• Second key point\n• Third key point";
  } else if (selectedMode === "detailed") {
    summary =
      "This is a detailed summary of the article. It includes the main ideas and supporting details.";
  }

  // Display the summary
  summaryOutput.textContent = summary;

  // Update the status message
  statusMessage.textContent = "Summary generated successfully.";

  // Enable the Copy button
  copyButton.disabled = false;
});

// Copy button click event
copyButton.addEventListener("click", async function () {
  const summary = summaryOutput.textContent;

  try {
    await navigator.clipboard.writeText(summary);
    statusMessage.textContent = "Summary copied to clipboard.";
  } catch (error) {
    statusMessage.textContent = "Unable to copy the summary.";
    console.error("Copy failed:", error);
  }
});
