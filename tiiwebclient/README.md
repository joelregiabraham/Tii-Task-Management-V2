# 1. Install all project deps
npm install


# Run from root dir of project - tiiwebclient
# 2. Install Playwright test runner
npm install -D @playwright/test

# 3. Install browser binaries
npx playwright install

# 4. Run tests
npx playwright test
