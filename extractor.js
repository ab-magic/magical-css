/**
 * Script to download and combine CSS from multiple stylesheets
 *
 * This script:
 * 1. Takes a string of stylesheet links separated by "\n"
 * 2. Extracts the URLs
 * 3. Fetches the content of each CSS file
 * 4. Combines them into a single CSS string
 * 5. Logs the combined CSS to the console
 */

// Function to extract CSS URLs from a string of link tags
function extractCssUrls(inputString) {
	const cssUrls = [];

	// Use a regular expression to match all link tags with stylesheets
	const regex =
		/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/g;

	let match;
	while ((match = regex.exec(inputString)) !== null) {
		// The URL will be in either group 1 or group 2 depending on attribute order
		const url = match[1] || match[2];
		if (url) {
			cssUrls.push(url);
		}
	}

	return cssUrls;
}

// Function to fetch CSS content from a URL
async function fetchCssContent(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.error(
				`Failed to fetch ${url}: ${response.status} ${response.statusText}`
			);
			return "";
		}
		return await response.text();
	} catch (error) {
		console.error(`Error fetching ${url}:`, error);
		return "";
	}
}

// Main function to process the input and combine CSS
async function combineCss(inputString) {
	// Extract CSS URLs
	const cssUrls = extractCssUrls(inputString);
	console.log(`Found ${cssUrls.length} CSS URLs:`, cssUrls);

	// Fetch content for each URL
	const cssContents = [];
	for (const url of cssUrls) {
		console.log(`Fetching CSS from: ${url}`);
		const content = await fetchCssContent(url);
		if (content) {
			cssContents.push(`/* Source: ${url} */`);
			cssContents.push(content);
			cssContents.push("\n");
		}
	}

	// Combine all CSS content
	const combinedCss = cssContents.join("\n");

	// Log the combined CSS to the console
	console.log("Combined CSS:");
	console.log(combinedCss);

	// Create a downloadable link (optional)
	const blob = new Blob([combinedCss], { type: "text/css" });
	const downloadUrl = URL.createObjectURL(blob);

	console.log("You can also download the combined CSS using this URL:");
	console.log(downloadUrl);

	return combinedCss;
}

// Usage:
// 1. Paste your link tags string here:
const cssLinksString = Array.from(document
	.querySelectorAll('link[rel="stylesheet"]'))
	.map((link) => link.outerHTML)
	.join("");

// 2. Run the function
combineCss(cssLinksString);
