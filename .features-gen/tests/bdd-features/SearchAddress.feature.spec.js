// Generated from: tests/bdd-features/SearchAddress.feature
import { test } from "playwright-bdd";

test.describe('Search detailed energy plan documents for your area', () => {

  test('Search energy plan documents by address', { tag: ['@regression'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('The user is on Origin Energy search page', null, { page }); 
    await When('User searches for energy plans using the valid address "7 Mopane Circuit, WYNDHAM VALE VIC 3024"', null, { page }); 
    await Then('The search results should display relevant energy plans for the provided address', null, { page }); 
    await When('User searches for energy plans using the "Natural Gas" filter', null, { page }); 
    await Then('The search results should display relevant "Natural Gas" energy plans for the provided address', null, { page }); 
    await When('User clicks on the energy plan "Origin Everyday Rewards Variable" from the search results', null, { page }); 
    await Then('The detailed PDF document for the selected energy plan should be displayed in a new browser tab', null, { page }); 
    await When('User downloads the energy plan PDF document', null, { page }); 
    await Then('The downloaded PDF document should be saved successfully on the user\'s device', null, { page }); 
    await And('Validate the downloaded PDF document content', {"dataTable":{"rows":[{"cells":[{"value":"ExpectedFilePath"},{"value":"ActualFilePath"}]},{"cells":[{"value":"fixtures/expectedDataFiles/OR2712190MR.pdf"},{"value":"'{S:pdfFilePath}'"}]}]}}); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests/bdd-features/SearchAddress.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":5,"tags":["@regression"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given The user is on Origin Energy search page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When User searches for energy plans using the valid address \"7 Mopane Circuit, WYNDHAM VALE VIC 3024\"","stepMatchArguments":[{"group":{"start":55,"value":"\"7 Mopane Circuit, WYNDHAM VALE VIC 3024\"","children":[{"start":56,"value":"7 Mopane Circuit, WYNDHAM VALE VIC 3024","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then The search results should display relevant energy plans for the provided address","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When User searches for energy plans using the \"Natural Gas\" filter","stepMatchArguments":[{"group":{"start":41,"value":"\"Natural Gas\"","children":[{"start":42,"value":"Natural Gas","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then The search results should display relevant \"Natural Gas\" energy plans for the provided address","stepMatchArguments":[{"group":{"start":43,"value":"\"Natural Gas\"","children":[{"start":44,"value":"Natural Gas","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When User clicks on the energy plan \"Origin Everyday Rewards Variable\" from the search results","stepMatchArguments":[{"group":{"start":31,"value":"\"Origin Everyday Rewards Variable\"","children":[{"start":32,"value":"Origin Everyday Rewards Variable","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then The detailed PDF document for the selected energy plan should be displayed in a new browser tab","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When User downloads the energy plan PDF document","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then The downloaded PDF document should be saved successfully on the user's device","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And Validate the downloaded PDF document content","stepMatchArguments":[]}]},
]; // bdd-data-end