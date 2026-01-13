/**
 * Build Words Script
 *
 * Converts YAML word lists to JSON for efficient loading.
 *
 * Usage: node scripts/build-words.js
 *
 * TODO: Implement the following:
 * 1. Import required modules (fs, path, js-yaml)
 * 2. Find all YAML files in words/ directory
 * 3. For each YAML file:
 *    - Read file content
 *    - Parse YAML to JSON
 *    - Validate structure (theme, levels, words)
 *    - Check that sentences contain their words
 *    - Write optimized JSON to public/words/
 * 4. Log success messages
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wordsDir = path.join(__dirname, '../words');
const outputDir = path.join(__dirname, '../public/words');

/**
 * TODO: Implement main()
 *
 * Main function to build word lists.
 *
 * Steps:
 * 1. Ensure output directory exists (create if not)
 * 2. Get all YAML files from words directory
 * 3. For each file, call processYamlFile()
 * 4. Log summary
 */
function main() {
  console.log('🔨 Building word lists...\n');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all YAML files
  const yamlFiles = fs.readdirSync(wordsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

  if (yamlFiles.length === 0) {
    console.error('❌ No YAML files found in words/ directory');
    process.exit(1);
  }

  let successCount = 0;

  for (const file of yamlFiles) {
    try {
      processYamlFile(file);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to process ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`\n✅ Successfully built ${successCount} word list(s)!`);
}

/**
 * TODO: Implement processYamlFile()
 *
 * Processes a single YAML file.
 *
 * Steps:
 * 1. Read file content
 * 2. Parse YAML to JavaScript object
 * 3. Validate structure using validateWordList()
 * 4. Write JSON to output directory
 * 5. Log success
 */
function processYamlFile(filename) {
  const inputPath = path.join(wordsDir, filename);
  const outputFilename = filename.replace(/\.ya?ml$/, '.json');
  const outputPath = path.join(outputDir, outputFilename);

  // Read and parse YAML
  const content = fs.readFileSync(inputPath, 'utf8');
  const data = yaml.load(content);

  // Validate structure
  validateWordList(data, filename);

  // Write JSON (minified)
  fs.writeFileSync(outputPath, JSON.stringify(data));

  console.log(`✓ ${filename} → ${outputFilename}`);
}

/**
 * TODO: Implement validateWordList()
 *
 * Validates word list structure.
 *
 * Steps:
 * 1. Check that data has 'theme' property
 * 2. Check that data has 'levels' array
 * 3. For each level:
 *    - Check level has 'level', 'name', 'words' properties
 *    - For each word:
 *      - Check word has 'word' and 'sentence' properties
 *      - Warn if sentence doesn't contain word
 * 4. Throw error if validation fails
 */
function validateWordList(data, filename) {
  if (!data.theme) {
    throw new Error(`Missing 'theme' property in ${filename}`);
  }

  if (!data.theme.id || !data.theme.name) {
    throw new Error(`Theme missing 'id' or 'name' in ${filename}`);
  }

  if (!Array.isArray(data.levels) || data.levels.length === 0) {
    throw new Error(`Missing or empty 'levels' array in ${filename}`);
  }

  for (const level of data.levels) {
    if (typeof level.level !== 'number') {
      throw new Error(`Level missing 'level' number in ${filename}`);
    }

    if (!level.name) {
      throw new Error(`Level ${level.level} missing 'name' in ${filename}`);
    }

    if (!Array.isArray(level.words) || level.words.length === 0) {
      throw new Error(`Level ${level.level} has no words in ${filename}`);
    }

    for (const wordEntry of level.words) {
      if (!wordEntry.word) {
        throw new Error(`Missing 'word' property in level ${level.level} of ${filename}`);
      }

      if (!wordEntry.sentence) {
        throw new Error(`Missing 'sentence' for word "${wordEntry.word}" in ${filename}`);
      }

      // Warn if sentence doesn't contain the word
      const sentenceLower = wordEntry.sentence.toLowerCase();
      const wordLower = wordEntry.word.toLowerCase();
      if (!sentenceLower.includes(wordLower)) {
        console.warn(`⚠️  Warning: Sentence doesn't contain word "${wordEntry.word}" in ${filename}`);
      }
    }
  }
}

// Run the script
main();
