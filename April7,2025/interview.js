const axios = require("axios");
const { JSDOM } = require("jsdom");

async function decodeSecretMessage(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Find the table in the document
    const table = document.querySelector("table");
    if (!table) {
      console.error("No table found in the document.");
      return;
    }

    const charMap = new Map();
    let maxX = 0;
    let maxY = 0;

    // Process each row in the table (skipping the header row)
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      const cells = row.querySelectorAll("td");
      if (cells.length < 3) return;

      const x = parseInt(cells[0].textContent.trim(), 10);
      const char = cells[1].textContent.trim();
      const y = parseInt(cells[2].textContent.trim(), 10);

      charMap.set(`${x},${y}`, char);
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });

    if (charMap.size === 0) {
      console.error("No valid character mappings found. Check the document structure.");
      return;
    }

    // Create and fill the grid with spaces
    const grid = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(' '));

    // Fill in characters from the map
    for (const [key, char] of charMap.entries()) {
      const [x, y] = key.split(',').map(Number);
      grid[y][x] = char; // y is row, x is column
    }

    // Print the grid
    console.log("Decoded Secret Message:");
    for (const row of grid) {
      console.log(row.join(''));
    }
  } catch (error) {
    console.error("Failed to retrieve or parse the document:", error);
  }
}

// Example usage:
decodeSecretMessage("https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub");