import { createBdd } from 'playwright-bdd';
import SearchPage from '../page-objects/searchPage';
import { PDFUtils } from '../../utils/pdf-utils';

const assert = require('assert');
const { Given, When, Then } = createBdd();
const { getStoredVariable } = require('../../utils/global-storage').default;

Given('The user is on Origin Energy search page', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.navigatetoEnergyCompareSearchPage();
});

When('User searches for energy plans using the valid address {string}', async ({ page }, address) => {
  const searchPage = new SearchPage(page);
  await searchPage.searchValidAddress(address);
});

Then('The search results should display relevant energy plans for the provided address', async ({ page }) => {
  // Verify that search results are displayed
  const searchPage = new SearchPage(page);
  const isTableVisible = await searchPage.isResultsTableVisible();
  assert.strictEqual(isTableVisible, true, 'Results table is not visible');
  const isResultShown = await searchPage.isSearchSuccessful();
  assert.strictEqual(isResultShown, true, 'No results are shown in the results table');
});

When('User searches for energy plans using the {string} filter', async ({ page }, filterType) => {
  // Apply filter based on filterType
  const searchPage = new SearchPage(page);
  // Assuming there is a method to apply filter, which needs to be implemented in SearchPage
  await searchPage.applyFilter(filterType);
});

Then('The search results should display relevant {string} energy plans for the provided address', async ({ page }, filterType) => {
  // Verify that search results are displayed for natural gas filter
  const searchPage = new SearchPage(page);
  const isTableVisible = await searchPage.isResultsTableVisible();
  assert.strictEqual(isTableVisible, true, 'Results table is not visible after applying Natural Gas filter');
  const isResultShown = await searchPage.isSearchSuccessful();
  assert.strictEqual(isResultShown, true, 'No results are shown in the results table after applying Natural Gas filter');

  // Additional verification can be added here to ensure that the results are specifically for natural gas plans  
  // For example, check if all displayed plans are for natural gas
  const isFilterApplied = await searchPage.verifyPlansInResults(filterType);
  assert.strictEqual(isFilterApplied, true, `All displayed plans are not for ${filterType}`);

});

When('User clicks on the energy plan {string} from the search results', async ({ page }, planName) => {
  // Click on the specified energy plan from the search results
  const searchPage = new SearchPage(page);
  await searchPage.clickOnEnergyPlan(planName);
});

When('User downloads the energy plan PDF document', async ({ page }) => {
  const downloadPDF = getStoredVariable('{S:pdfFilePath}');
  // Download the PDF document for the selected energy plan  
  await PDFUtils.downloadPdfFromPage(downloadPDF);  
});



