import { createBdd } from 'playwright-bdd';
import { PDFUtils } from '../../utils/pdf-utils';
import * as path from 'path';

const assert = require('assert');
const { Given, When, Then } = createBdd();
const { getStoredVariable } = require('../../utils/global-storage').default;

Then('The detailed PDF document for the selected energy plan should be displayed in a new browser tab', async ({ page }) => {
    // Verify that the PDF document is displayed in a new tab  
    const isPdfDisplayed = await PDFUtils.pdfDocumentDisplayedInNewBrowserTab(page);
    assert.strictEqual(isPdfDisplayed, true, 'PDF document for the plan is not displayed in a new tab');
});

Then('The downloaded PDF document should be saved successfully on the user\'s device', async ({ page }) => {
    // Verify that the PDF document is downloaded successfully
    const pdfDownloaded = await PDFUtils.isPdfDownloaded(getStoredVariable('{S:pdfFilePath}'));
    assert.strictEqual(pdfDownloaded, true, `PDF document ${getStoredVariable('{S:pdfFilePath}')} was not downloaded successfully`);
});

Then('Validate the downloaded PDF document content', async ({ }, dataTable) => {
    for (const row of dataTable.hashes()) {
        let expectedFilePath = row.ExpectedFilePath;
        const actualFilePath = getStoredVariable(row.ActualFilePath);
        const rootDir = process.cwd();
        expectedFilePath = path.join(rootDir, expectedFilePath);
        const isContentMatching = await PDFUtils.comparePDFFiles(expectedFilePath, actualFilePath);
        assert.strictEqual(isContentMatching, true, `PDF content does not match between ${expectedFilePath} and ${actualFilePath}`);
    }
});

