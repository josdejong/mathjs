import { generateEntryFiles } from './entryGenerator.js'

try {
  await generateEntryFiles()
  console.log('Generated entry files (src/**/*.generated.js)')
} catch (err) {
  console.error('Failed to generate entry files:', err)
  process.exit(1)
}