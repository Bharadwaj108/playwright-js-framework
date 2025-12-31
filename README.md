# Playwright JavaScript Automation Framework

A modular, scalable, and enterprise‑ready automation framework built using **Playwright**, **Javascript**, **Cucumber (BDD)**, and the **Page Object Model (POM)**. Designed for high‑quality engineering teams that require maintainability, reliability, and CI/CD‑friendly test execution.

---

## 1. Overview
This framework provides a robust foundation for end‑to‑end UI automation, BDD‑style collaboration. It follows industry best practices for structure, readability, and long‑term maintainability.

---

## 2. Key Features
- Playwright + JavaScript for fast, modern, reliable automation  
- Cucumber BDD with `.feature` files for business‑readable scenarios  
- Page Object Model (POM) for clean separation of concerns  
- Reusable utilities for API calls, waits, logging, and environment handling  
- Parallel execution for faster test cycles  
- Environment‑based configuration (dev/test/prod)  
- HTML & Playwright reports for clear visibility  
- CI/CD ready (GitHub Actions, Azure DevOps, Jenkins)

---

## 📁 Project Structure

The following directory structure illustrates how the framework is organised:

playwright-ts-framework/
│
├── tests/
│   ├── bdd-features/          # Gherkin feature files
│   ├── bdd-steps/             # Step definitions
│   ├── page-objects/          # Page Object Model classes
│   ├── fixtures/              # Test data
│   └── utils/                 # Helpers, API clients, custom utilities
│
├── config/
│   ├── playwright.config.ts   # Playwright configuration
│   ├── env.config.ts          # Environment variables
│
├── reports/                   # Test reports
├── package.json
├── tsconfig.json
└── README.md

---

## 4. Installation

### Clone the repository
  
 ```
 git clone https://github.com/Bharadwaj108/playwright-ts-frameork.git
```


---


## 5. Run scripts
### Run all tests
- npm run run-all-tests-headed
### Run with Playwright UI mode
- npm run open-playwright-ui
### Run Report
- npm run show-report

---

## 6. Reporting
- HTML Reports are stored under "./reports"

---

## 7. Run tests with a specific environment:
-  Example to run test in test env
  ```
    NODE_ENV=test npx playwright test --headed
  ```
---






 
