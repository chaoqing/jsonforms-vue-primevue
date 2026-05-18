// scripts/visual-check.mjs
// Usage: node scripts/visual-check.mjs
// Requires: dev server running at localhost:5173
//
// Prerequisites:
//   pnpm add -D playwright
//   npx playwright install chromium

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { join } from 'path';

const SCREENSHOT_DIR = join(process.cwd(), 'screenshots');
const BASE_URL = 'http://localhost:5173';

// Map each renderer to the best example that exercises it.
// The dev app is a single-page app: select example from sidebar, wait for render, screenshot.
const RENDERERS = [
  // Controls (17)
  { name: 'StringControlRenderer', category: 'controls', example: 'string' },
  { name: 'IntegerControlRenderer', category: 'controls', example: 'numbers' },
  { name: 'NumberControlRenderer', category: 'controls', example: 'numbers' },
  { name: 'BooleanControlRenderer', category: 'controls', example: 'control-options' },
  { name: 'BooleanToggleControlRenderer', category: 'controls', example: 'control-options' },
  { name: 'DateControlRenderer', category: 'controls', example: 'dates' },
  { name: 'DateTimeControlRenderer', category: 'controls', example: 'dates' },
  { name: 'TimeControlRenderer', category: 'controls', example: 'dates' },
  { name: 'EnumControlRenderer', category: 'controls', example: 'enum' },
  { name: 'OneOfEnumControlRenderer', category: 'controls', example: 'enum' },
  { name: 'MultiStringControlRenderer', category: 'controls', example: 'text' },
  { name: 'PasswordControlRenderer', category: 'controls', example: 'login' },
  { name: 'RadioGroupControlRenderer', category: 'controls', example: 'radio-group' },
  { name: 'OneOfRadioGroupControlRenderer', category: 'controls', example: 'radio-group' },
  { name: 'SliderControlRenderer', category: 'controls', example: 'numbers' },
  { name: 'StringMaskControlRenderer', category: 'controls', example: 'string' },
  { name: 'AnyOfStringOrEnumControlRenderer', category: 'controls', example: 'person' },

  // Layouts (6)
  { name: 'VerticalLayoutRenderer', category: 'layouts', example: 'layout-vertical' },
  { name: 'HorizontalLayoutRenderer', category: 'layouts', example: 'layout-horizontal' },
  { name: 'GroupRenderer', category: 'layouts', example: 'layout-group' },
  { name: 'ArrayLayoutRenderer', category: 'layouts', example: 'array' },
  { name: 'CategorizationRenderer', category: 'layouts', example: 'categorization' },
  { name: 'CategorizationStepperRenderer', category: 'layouts', example: 'categorizationstepper' },

  // Complex (8)
  { name: 'AllOfRenderer', category: 'complex', example: 'allOf' },
  { name: 'AnyOfRenderer', category: 'complex', example: 'anyOf' },
  { name: 'OneOfRenderer', category: 'complex', example: 'oneOf' },
  { name: 'OneOfTabRenderer', category: 'complex', example: 'oneOf' },
  { name: 'ObjectRenderer', category: 'complex', example: 'object' },
  { name: 'ArrayControlRenderer', category: 'complex', example: 'stringArray' },
  { name: 'EnumArrayRenderer', category: 'complex', example: 'multi-enum' },
  { name: 'MixedRenderer', category: 'complex', example: 'mixed-object' },

  // Additional (2)
  { name: 'LabelRenderer', category: 'additional', example: 'layout-complex' },
  { name: 'ListWithDetailRenderer', category: 'additional', example: 'list-with-detail' },

  // Extended (2)
  { name: 'AutocompleteEnumControlRenderer', category: 'extended', example: 'person' },
  { name: 'AutocompleteOneOfEnumControlRenderer', category: 'extended', example: 'person' },
];

async function main() {
  // Create directories
  const categories = ['controls', 'layouts', 'complex', 'additional', 'extended'];
  for (const cat of categories) {
    await fs.mkdir(join(SCREENSHOT_DIR, cat), { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // Navigate to the dev app
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  for (const renderer of RENDERERS) {
    const { name, category, example } = renderer;
    const filepath = join(SCREENSHOT_DIR, category, `${name}.png`);

    console.log(`Screenshotting ${name} (example: ${example})...`);

    try {
      // Open the sidebar drawer
      const menuButton = page.locator('button[aria-label="Menu"], .app-bar button, header button').first();
      await menuButton.click();
      await page.waitForTimeout(300);

      // Click the example in the sidebar
      const exampleButton = page.locator(`nav button:has-text("${example}")`).first();
      if (await exampleButton.count() === 0) {
        // Try searching for the example
        const searchInput = page.locator('.drawer-search input, input[placeholder*="Search"]');
        await searchInput.fill(example);
        await page.waitForTimeout(300);
      }

      const exampleBtn = page.locator(`nav button:has-text("${example}")`).first();
      await exampleBtn.click();
      await page.waitForTimeout(1500); // Wait for PrimeVue to hydrate and render

      // Screenshot the form area (main content)
      const formArea = page.locator('.main-content, .json-forms').first();
      if (await formArea.count() > 0) {
        await formArea.screenshot({ path: filepath });
      } else {
        await page.screenshot({ path: filepath, fullPage: false });
      }

      console.log(`  Saved: ${filepath}`);
    } catch (err) {
      console.error(`  ERROR screenshotting ${name}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${SCREENSHOT_DIR}`);
}

main().catch(console.error);
