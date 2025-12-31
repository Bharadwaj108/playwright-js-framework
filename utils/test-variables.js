/**
 * This file can be used to store and retrieve data shared across test scenarios
 * It's purpose is to retain a separation of page and lib code from the testing framework (cucumber).
 */

const createStore = () => ({
    variablesList: [],
    workflowsList: [],
    usersList: [],
    tokenList: [],
    taskList: [],
    connectionsList: [],
    testId: null,
    testIdList: [],
});

const infoToSave = [];
let scenarioStore = createStore();
let featureStore = createStore();

function getStores(testId = null) {
    if (testId) {
        scenarioStore.testId = testId;
        // Only record each unique test id once
        if (!scenarioStore.testIdList.find((id) => id === testId)) {
            scenarioStore.testIdList.push(testId);
        }
        featureStore.testId = testId;
        // Only record each unique test id once
        if (!featureStore.testIdList.find((id) => id === testId)) {
            featureStore.testIdList.push(testId);
        }
    }
    return {
        scenarioStore,
        featureStore,
    };
}

/**
 * The scenario store is a place to save data that can be used across steps within a single scenario.
 * This function is called in a After scenario hook.
 */
function clearScenarioStore() {
    infoToSave.push(scenarioStore);
    scenarioStore = createStore();
    return scenarioStore;
}

/**
 * The feature store is a place to save data that can be used across steps/scenarios.
 * This function is called in a AfterAll hook.
 */
function clearFeatureStore() {
    infoToSave.push(featureStore);
    featureStore = createStore();
    return featureStore;
}

module.exports = {
    getStores,
    clearScenarioStore,
    clearFeatureStore,
};
