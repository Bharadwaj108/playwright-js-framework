// import * as fs from 'fs';
// import * as path from 'path';
// import { PDFParse } from 'pdf-parse';

// import pdf from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';

import pdf from 'pdf-parse-fixed';
const fs = require('fs');
const path = require('path');
const { storeVariable, getStoredVariable } = require('../utils/global-storage').default;


export class PDFUtils {
    static comparePdfContent(actualContent, expectedContent) {
        if (actualContent.length !== expectedContent.length) {
            return false;
        }
        for (let i = 0; i < actualContent.length; i++) {
            if (actualContent[i].trim() !== expectedContent[i].trim()) {
                return false;
            }
        }
        return true;
    }

    static async testPDF(pathToPdf) {
        const buffer = await readFile(pathToPdf);
        const data = new PDFParse({ data: buffer });
        return await data.getText();

    }

    static async extractTextFromPdf(pathToPdf) {
        const dataBuffer = fs.readFileSync(pathToPdf);
        const pdfData = await pdf(dataBuffer);
        return pdfData.text;
    }

    static paresePDFtoArray(pathToPdf) {
        return new Promise((resolve, reject) => {
            const resolvedFilePath = path.resolve(pathToPdf);
            const dataBuffer = fs.readFileSync(resolvedFilePath);
            pdf(dataBuffer).then(pdfData => {
                const arr = pdfData.text.trim().split('\n');
                resolve(arr);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static comparePDFFiles(expectedFilePath, actualFilePath) {
        return new Promise(async (resolve, reject) => {
            try {
                const expectedText = await this.extractTextFromPdf(expectedFilePath);
                const actualText = await this.extractTextFromPdf(actualFilePath);

                const expectedLines = expectedText.toString().trim().split('\n');
                const actualLines = actualText.toString().trim().split('\n');

                const isEqual = this.comparePdfContent(actualLines, expectedLines);
                resolve(isEqual);
            } catch (error) {
                reject(error);
            }
        });
    }

    static suggestedFilename() {
        // generate suggested filename for the downloaded PDF
        return `energy-plan-${Date.now()}.pdf`;
    }

    static async downloadPdfFromPage(fileOutputPath, waitTime = 15000) {
        const url = getStoredVariable('{S:pdfUrl}');
        const page = getStoredVariable('{S:pdfPage}');

        const pdfResponse = await page.request.get(
            url
        );

        const buffer = await pdfResponse.body();
        await fs.promises.writeFile(fileOutputPath, buffer);

    }

    /**
     * 
     * @param {string} filePath 
     * @param {number} waitTime 
     * @returns 
     * check to see if the file has been downloaded and save to the location
     */
    static async isPdfDownloaded(filePath, waitTime = 15000) {
        // Verify that the PDF document was downloaded successfully
        const start = Date.now();
        return new Promise((resolve) => {
            const checkFile = () => {
                if (fs.existsSync(filePath)) {
                    resolve(true);
                } else if (Date.now() - start > waitTime) {
                    resolve(false);
                } else {
                    setTimeout(checkFile, 500); // Check every 500ms
                }
            };
            checkFile();
        });
    }

    /**
     * 
     * @param {*} page 
     * @param {number} waitTime 
     * @returns 
     * validates if the pdf is opened in a new browser tab
     */
    static async pdfDocumentDisplayedInNewBrowserTab(page, waitTime = 15000) {
       
        //build the complete file Path
        const rootDir = process.cwd();
        const outputPath = path.join(rootDir, '/tempFiles');
        fs.mkdir(outputPath, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error creating directory: ${err}`);
                return false;
            } else {
                console.log('Directory created successfully!');
            }
        });

        // prepare file output path and store in global storage
        const outputFileName = this.suggestedFilename();
        storeVariable('{S:pdfFileName}', outputFileName);
        const fileOutputPath = path.join(outputPath, outputFileName);
        storeVariable('{S:pdfFilePath}', fileOutputPath);

        const context = page.context();

        let newPage = null;

        try {
            [newPage] = await Promise.all([
                context.waitForEvent('page', { timeout: waitTime }),
                // your click goes here
            ]);
        } catch (err) {
            // No new page opened within timeout
            newPage = null;
        }
        storeVariable('{S:pdfPage}', newPage);

        // Now safely check
        if (!newPage) {
            console.log("No new tab opened — likely headless mode or PDF viewer disabled.");
            return false;
        }        
        return true;        
    }

}