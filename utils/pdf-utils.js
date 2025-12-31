// import * as fs from 'fs';
// import * as path from 'path';
import { PDFParse } from 'pdf-parse';
import { readFile, writeFile } from 'node:fs/promises';
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
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
        // return new Promise((resolve, reject) => {
        //     // const resolvedFilePath = path.resolve(pathToPdf);
        //     const dataBuffer = fs.readFileSync(pathToPdf);
        //     const parse = pdf(dataBuffer);
        //     parse.then(function (data) {
        //         resolve(data.text);
        //     }).catch(err => {
        //         reject(err);
        //     });
        // });

        const buffer = await readFile(pathToPdf);
        const data = new PDFParse({ data: buffer });
        return await data.getText();
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

                const expectedLines = expectedText.text.toString().trim().split('\n');
                const actualLines = actualText.text.toString().trim().split('\n');

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
        // const url = getStoredVariable('{S:pdfUrl}');
        // const page = getStoredVariable('{S:pdfPage}');
        // Listen for PDF responses
        // page.on('response', async (response) => {
        //     const resUrl = response.url();

        //     if (resUrl.endsWith('.pdf')) {
        //         console.log('PDF detected:', resUrl);

        //         const buffer = await response.body();
        //         fs.writeFileSync(fileOutputPath, buffer);

        //         console.log(`PDF saved as: ${fileOutputPath}`);
        //     }
        // });
        // await page.goto(url, { waitUntil: 'networkidle', timeout: waitTime });

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
    // Verify that the PDF document is displayed in a new tab
    const [newPage] = await Promise.all([
        page.context({
            acceptDownloads: true
        }).waitForEvent('page'),
        // Assuming clicking on the plan link opens the PDF in a new tab
    ]);
    await newPage.waitForLoadState('load', { timeout: waitTime });
    const url = newPage.url();
    storeVariable('{S:pdfUrl}', url);
    storeVariable('{S:pdfPage}', newPage);


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

    // Simple check to see if the URL contains '.pdf'
    return url.includes('.pdf');

}

}