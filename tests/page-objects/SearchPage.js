
import { Page, Locator } from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';

const { storeVariable, getStoredVariable } = require('../../utils/global-storage').default;

export class SearchPage {
    page = null;
    searchLocator = null;
    searchOption = null;
    tickLocator = null;
    resultsTableLocator = null;
    resultRowsLocator = null;
    naturalgasCheckboxLocator = null;
    electricityCheckboxLocator = null;
    planLinkLocator = null;
    constructor(page) {
        this.page = page;
        // init the locators        
        this.searchLocator = page.getByRole('combobox', { name: 'Your address' });
        this.searchOption = (address) => page.getByRole('option', { name: address });
        this.tickLocator = page.locator('//span[@data-id="input-adornment"]/*[@data-id="IconCheckCircle"]/*[@id="check-circle--checkmark-addition-circle-success-check-validation-add-form-tick"]');
        this.resultsTableLocator = page.locator('//div[contains(@class,"PrivateHiddenCss-mdDown ")]//table[@data-id="table"]');
        this.resultRowsLocator = this.resultsTableLocator.locator('//tr');
        this.naturalgasCheckboxLocator = page.getByRole('checkbox', { name: 'Natural gas' });
        this.electricityCheckboxLocator = page.getByRole('checkbox', { name: 'Electricity' });
        this.planLinkLocator = (planName) => page.getByRole('link', { name: planName });

    }

    async navigatetoEnergyCompareSearchPage() {
        // navigate top the energy compare search page
        await this.page.goto(process.env.BASE_URL);
    }

    /**
     * 
     * @param {string} address
     * Search for the valid address provided 
     * Assuming : The provided address is only valid
     */
    async searchValidAddress(address) {
        // enter the address in the search box 
        await this.searchLocator.click();
        await this.searchLocator.fill(address);
        await this.searchOption(address).waitFor({ state: 'visible', timeout: 15000 });
        await this.searchOption(address).click();
        //wait for the tick mark to appear
        await this.tickLocator.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * 
     * @returns 
     * returns the rowcount of the search results displayed inside the table
     */
    async getNumberOfResults() {
        // return the number of result rows
        return await this.resultRowsLocator.count();
    }

    /**
     * 
     * @returns 
     * returns a boolean value based on if the search table results is visible or not
     */
    async isResultsTableVisible() {
        // return true if results table is visible
        await this.resultsTableLocator.waitFor({ state: 'visible', timeout: 15000 });
        return await this.resultsTableLocator.isVisible();
    }

    /**
     * 
     * @returns 
     * returns a boolean value based on if the search table rows are visible or not
     */
    async isSearchSuccessful() {
        // validate if at least one result is shown
        const rowCount = await this.getNumberOfResults();
        return rowCount > 0;
    }

    async applyFilter(filterType, waitTime = 15000) {
        // Apply filter based on filterType
        if (filterType === 'Natural Gas') {
            await this.electricityCheckboxLocator.uncheck();
        } else if (filterType === 'Electricity') {
            await this.naturalgasCheckboxLocator.uncheck();
        }
        // Wait for results to update after applying filter
        await this.resultsTableLocator.waitFor({ state: 'visible', timeout: waitTime });
    }

    /**
     * 
     * @param {*} filterType 
     * @param {*} energyTypeColIndex 
     * @returns 
     * verify if the table results contains the applied filter values
     */
    async verifyPlansInResults(filterType, energyTypeColIndex = 1) {
        // Verify that all displayed plans are for the specified energy type    
        const rowCount = await this.getNumberOfResults();
        // first row is a theader row, so start from 1
        for (let i = 1; i <= rowCount - 1; i++) {
            const rowLocator = this.resultRowsLocator.nth(i);
            await rowLocator.waitFor({ state: 'visible', timeout: 5000 }).then(async () => {
                console.log(`Row ${i} Energy Type Row is visible`);
            });
            const energyTypeCell = rowLocator.locator('//td').nth(energyTypeColIndex); // assuming energy type is in the specified column index    
            await energyTypeCell.waitFor({ state: 'visible', timeout: 5000 }).then(async () => {
                console.log(`Row ${i} Col ${energyTypeColIndex} Energy Type Cell is visible`);
            });
            const energyTypeText = await energyTypeCell.innerText();
            if (!energyTypeText.toLowerCase().trim().includes(filterType.toLowerCase().trim())) {
                return false; // Found a plan that is not for the specified energy type
            }
        }
        return true; // All plans are for the specified energy type
    }

    /**
     * 
     * @param {string} planName 
     * @param {number} waitTime
     * click on the specified energy plan from the search results 
     */
    async clickOnEnergyPlan(planName, waitTime = 15000) {
        // Click on the specified energy plan from the search results        
        const planLinkLocator = this.planLinkLocator(planName);
        await planLinkLocator.waitFor({ state: 'visible', timeout: waitTime });
        await planLinkLocator.click();
    }
    
}

