# Quick README: Playwright Automation Framework

A short map of the framework: each feature, the files that implement it, and the concept, class, library or method behind it. For setup steps and detail, see [README.md](README.md).

**Stack:** `@playwright/test` · TypeScript (strict) · dotenv · cross-env · crypto-js · Faker · SheetJS (`xlsx`) · csv-parse · Ajv · Allure · ESLint + Prettier · GitHub Actions

**Apps under test:** OrangeHRM (UI) · Restful Booker (API)

---

## 1. Core setup and execution

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Central configuration | [playwright.config.ts](playwright.config.ts) | `defineConfig()`; `use` block for `baseURL`, `actionTimeout`, `navigationTimeout`; `globalTimeout` |
| Multi-browser runs | [playwright.config.ts](playwright.config.ts) | `projects[]` with `devices['Desktop Chrome' / 'Desktop Firefox' / 'Desktop Safari']` |
| UI and API in one framework | [playwright.config.ts](playwright.config.ts) | Separate `apiTest` project with its own `testDir`, `baseURL` (`API_BASE_URL`) and `extraHTTPHeaders` |
| Multi-environment (dev, SIT, …) | [playwright.config.ts](playwright.config.ts), [env-files/.env.example](env-files/.env.example), [package.json](package.json) | `dotenv.config({ path: .env.${ENV_NAME} })`, falling back to `.env.dev`; `cross-env ENV_NAME=SIT` in npm scripts |
| CI-aware behaviour | [playwright.config.ts](playwright.config.ts) | `process.env.CI` switches `retries`, `workers` and `forbidOnly` |
| Run shortcuts | [package.json](package.json) | npm scripts per env and browser (`test_SIT_ch_hl`, `test_api`, …); `pretest` hook generates data first |

## 2. UI design: Page Object Model

| Feature | Files | Concept / class / library / method |
|---|---|---|
| One class per screen | [pages/LoginPage.ts](pages/LoginPage.ts), [pages/DashboardPage.ts](pages/DashboardPage.ts), [pages/SideMenuPage.ts](pages/SideMenuPage.ts), [pages/PIMPage.ts](pages/PIMPage.ts), [pages/AdminPage.ts](pages/AdminPage.ts) | POM classes; `readonly` `Locator` fields set in the constructor from a `Page` |
| Stable locators | `pages/*` | `getByRole()`, `getByPlaceholder()`, `getByText()` |
| Business-level actions | `pages/*` | `loginToOrgangeHRM()`, `addEmployeeWithDetails()`, `selectEmployeeFromAutoSuggest()`, `searchEmployee()`, `deleteEmployee()`, `addAdminUser()`, `deleteUser()`, `logout()` |
| Web-first assertions | `pages/*`, `tests/*` | `expect(locator).toBeVisible / toHaveText / toHaveCount / toContainText`, `expect(page).toHaveURL()` with auto-retry |

## 3. Fixtures (dependency injection, setup and teardown)

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Page objects injected into tests | [fixtures/POMfixture.ts](fixtures/POMfixture.ts) | `test.extend<POMFixture>()`; each fixture does `use(new XxxPage(page))` |
| Utility fixtures | [fixtures/commonFixture.ts](fixtures/commonFixture.ts) | Extends `POMfixture`; adds `encdec` (`encryptionDecryption`) and `apiMock` (`APIMockUtils`) |
| Hook fixtures (before/after) | [fixtures/hooks-fixture.ts](fixtures/hooks-fixture.ts) | Code before `use()` is setup (`gotoURL`), code after `use()` is teardown (`logout`) |
| Layered chain | `fixtures/*` | `POMfixture` → `commonFixture` → `hooks-fixture`; each layer re-exports `test` and `expect` |
| API fixtures with auto-cleanup | [fixtures/commonAPIFixture.ts](fixtures/commonAPIFixture.ts) | `tokenFixture` (`CommonAPIUtils`), `bookingAPI` (`BookingAPI`), `bookingId` creates a booking and deletes it after the test |

## 4. Authentication and security

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Log in once, reuse the session | [tests/ui-tests/global.setup.ts](tests/ui-tests/global.setup.ts), [playwright.config.ts](playwright.config.ts) | `setup` project + `dependencies: ['setup']`; `page.context().storageState({ path })`; projects load `storageState: auth.json` |
| Test the real login | [tests/ui-tests/login.spec.ts](tests/ui-tests/login.spec.ts) | `test.use({ storageState: { cookies: [], origins: [] } })` clears the saved session |
| Encrypted credentials | [utils/encryptionDecryption.ts](utils/encryptionDecryption.ts) | `crypto-js`: `AES.encrypt()` / `AES.decrypt()` with `enc.Utf8`; `SECRET_KEY` read from the shell at run time |
| Encrypt a new value | [scripts/encrypt.ts](scripts/encrypt.ts) | `npm run encrypt -- "<value>"` via `tsx`; reads `process.argv` |
| API auth token | [utils/CommonAPIUtils.ts](utils/CommonAPIUtils.ts) | `getAuthToken(request)`: decrypts creds, `request.post(auth_endpoint)`, returns the token |
| Secrets kept out of git | [.gitignore](.gitignore) | `env-files/.env.*`, `auth-file/` ignored; CI uses GitHub Secrets |

## 5. Test data

| Feature | Files | Concept / class / library / method |
|---|---|---|
| One reader for every format | [utils/TestDataReader.ts](utils/TestDataReader.ts) | Generic `readTestData<T>(path, sheet?)`; picks parser by `path.extname()` → `JSON.parse`, `csv-parse/sync` `parse()`, SheetJS `XLSX.readFile()` + `sheet_to_json()` |
| Data-driven from JSON | [test-data/ui-data/employee.json](test-data/ui-data/employee.json) → [tests/ui-tests/addEmployee.spec.ts](tests/ui-tests/addEmployee.spec.ts) | `for…of` over rows creates one `test()` per row |
| Data-driven from CSV | [test-data/ui-data/addEmployeeValidation.csv](test-data/ui-data/addEmployeeValidation.csv) → [tests/ui-tests/addEmployeeValidation.spec.ts](tests/ui-tests/addEmployeeValidation.spec.ts) | CSV rows (strings) mapped to fields; tags split from a column |
| Business-owned Excel | [test-data/ui-data/excel/hr-new-joiners.xlsx](test-data/ui-data/excel/hr-new-joiners.xlsx) → [scripts/convert-new-joiners.ts](scripts/convert-new-joiners.ts) → [tests/ui-tests/hrNewJoiners.spec.ts](tests/ui-tests/hrNewJoiners.spec.ts) | Converter keeps `Run = Y` rows, validates them (row numbers from `__rowNum__`), writes JSON before Playwright starts |
| Shared data type | [test-data/ui-data/types.ts](test-data/ui-data/types.ts) | TypeScript type `EmployeeData`, used by the spec and the converter |
| Dynamic data | [test-data/ui-data/employe.factory.ts](test-data/ui-data/employe.factory.ts), [utils/uniqueID.ts](utils/uniqueID.ts) | `@faker-js/faker` (`faker.person`, `faker.internet`); `uniqueID()` from `Date.now()` |
| API data | [test-data/api-data/](test-data/api-data/) | JSON files for endpoints, payloads, negative cases, schema and mock data, loaded with `import` |

## 6. API testing

| Feature | Files | Concept / class / library / method |
|---|---|---|
| CRUD tests | [tests/api-tests/restful-booker-api.spec.ts](tests/api-tests/restful-booker-api.spec.ts) | `request` fixture (`APIRequestContext`): `get / post / put / patch / delete` |
| Reusable API client | [utils/BookingAPI.ts](utils/BookingAPI.ts) | `createBooking()`, `getBooking()`, `deleteBooking()`; `request` passed as a method parameter |
| End-to-end flow | [tests/api-tests/restful-booker-E2E.spec.ts](tests/api-tests/restful-booker-E2E.spec.ts) | Create → token → PATCH → DELETE → GET 404, each in a `test.step()` |
| Auth checks | [tests/api-tests/restful-booker-auth.spec.ts](tests/api-tests/restful-booker-auth.spec.ts) | Token sent as a `Cookie: token=…` header; missing / bad token cases |
| Negative tests and known defects | [tests/api-tests/restful-booker-negative.spec.ts](tests/api-tests/restful-booker-negative.spec.ts) | Invalid payloads; `test.fail()` marks a known defect |
| Schema validation | [tests/api-tests/schema.spec.ts](tests/api-tests/schema.spec.ts), [test-data/api-data/api-schema.json](test-data/api-data/api-schema.json) | `ajv`: `new Ajv().compile(schema)` then `validate(body)` |

## 7. Network mocking (UI)

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Mock, modify, fail or abort calls | [utils/APIMockUtils.ts](utils/APIMockUtils.ts) | `page.route()` with `route.fulfill()`, `route.fetch()`, `route.abort()`, `route.fallback()`; `page.unroute()` |
| Mocked UI tests | [tests/ui-tests/PIMMock.spec.ts](tests/ui-tests/PIMMock.spec.ts), [test-data/api-data/mock-data.json](test-data/api-data/mock-data.json) | `mockResponse()` (empty and fake lists), `modifyResponse()` (patch the real response) |

## 8. Tags, traceability and reporting

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Tags | specs, data files | `{ tag: ['@smoke', …] }` on `test` / `test.describe`; run with `--grep @smoke` |
| Traceability | specs | `annotation: { type: 'Jira ID' / 'test Case ID', description }` |
| Readable steps | specs | `test.step()` shows named steps in the reports |
| Reports | [playwright.config.ts](playwright.config.ts), [package.json](package.json) | `reporter`: `html`, `allure-playwright`, `junit` locally; `allure-playwright` only in CI (`process.env.CI`); `allure:serve` script |
| Failure evidence | [playwright.config.ts](playwright.config.ts) | `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'` |

## 9. Code quality and CI/CD

| Feature | Files | Concept / class / library / method |
|---|---|---|
| Type safety | [tsconfig.json](tsconfig.json) | `strict: true`; `npx tsc --noEmit` in CI |
| Linting and formatting | [eslint.config.mjs](eslint.config.mjs) | `typescript-eslint` (type-aware, `no-floating-promises` catches a missing `await`), `eslint-plugin-playwright`, `eslint-config-prettier` |
| CI pipeline | [.github/workflows/playwright.yml](.github/workflows/playwright.yml) | GitHub Actions; triggers on `push`, `pull_request`, nightly `schedule` (cron) and `workflow_dispatch` (choose browser / grep) |
| Smart test selection | same | `GREP` env: `@smoke` on push/PR, everything nightly, user input on manual runs |
| Parallel CI runs | same | `strategy.matrix` sharding (`--shard=i/n`): 3 UI shards, 5 API shards; `fail-fast: false` |
| Efficient runs | same | `concurrency` cancels older runs; `cache: npm`; installs only the chosen browser |
| Merged shard reports | same | `merge-reports` job: `actions/download-artifact` (`pattern`, `merge-multiple`) combines Allure results from every shard into one folder |
| Allure on GitHub Pages | same | `publish-allure` job (main only): `npm run allure:generate`, history copied from the live site for trends, `actions/upload-pages-artifact` + `actions/deploy-pages` |

---

## Quick commands

```powershell
$env:SECRET_KEY = "<team secret>"   # required for decryption
npm run test_SIT_ch_hl              # SIT, Chromium, headless
npm run test_api                    # API tests only
npx playwright test --grep @smoke   # run by tag
npm run allure:serve                # open the Allure report
npm run lint                        # ESLint check
```
