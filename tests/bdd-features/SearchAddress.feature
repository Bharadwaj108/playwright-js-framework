Feature: Search detailed energy plan documents for your area
    Search for Origin energy plans based on the user address

    @regression
    Scenario: Search energy plan documents by address        
        Given The user is on Origin Energy search page
        When User searches for energy plans using the valid address "7 Mopane Circuit, WYNDHAM VALE VIC 3024"
        Then The search results should display relevant energy plans for the provided address
        When User searches for energy plans using the "Natural Gas" filter
        Then The search results should display relevant "Natural Gas" energy plans for the provided address
        When User clicks on the energy plan "Origin Everyday Rewards Variable" from the search results
        Then The detailed PDF document for the selected energy plan should be displayed in a new browser tab
        When User downloads the energy plan PDF document
        Then The downloaded PDF document should be saved successfully on the user's device
        And Validate the downloaded PDF document content
            | ExpectedFilePath                           | ActualFilePath    |
            | fixtures/expectedDataFiles/OR2712190MR.pdf | '{S:pdfFilePath}' |