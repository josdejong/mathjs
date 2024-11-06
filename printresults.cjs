const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Define the YAML file and log file template
const yamlFile = '.updatedhyperexecute.yaml';
const logFileTemplate = 'logs/{jobID}/scenarios/karma start test-browser-test-config-lt_karma.js';

// Function to extract jobID from YAML
function getJobIdFromYaml(file) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/jobID:\s*([^\s]+)/);
  return match ? match[1] : null;
}

// Function to read last 50 lines of a file and filter for "TOTAL"
function tailAndFilter(filePath, keyword) {
  const lines = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf8' }),
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    lines.push(line);
    if (lines.length > 50) lines.shift();
  });

  rl.on('close', () => {
    const filteredLines = lines.filter(line => line.includes(keyword));
    filteredLines.forEach(line => console.log(line));
  });
}

// Main function
async function main()  {
  const jobId = getJobIdFromYaml(yamlFile);
  if (!jobId) {
    console.error("Error: jobID not found in the YAML file.");
    return;
  }

  // Construct log file path and ensure compatibility with different platforms
  const logFilePath = path.join(...logFileTemplate.replace('{jobID}', jobId).split('/'));

  // Check if the log file exists
  if (!fs.existsSync(logFilePath)) {
    console.error(`Error: Log file not found at path ${logFilePath}`);
    return;
  }

  console.log("///////////////////////////")
  // Retrieve the last 50 lines containing the keyword "TOTAL"
  await tailAndFilter(logFilePath, "TOTAL");
}

// Run the main function
main();
