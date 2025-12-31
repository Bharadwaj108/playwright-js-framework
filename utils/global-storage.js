// import { guid } from 'uuid/dist/v4';
/* eslint-disable no-cond-assign */
import { createReadStream } from 'fs';
import { generate } from 'shortid';

// import env from '../support/environment';
import { getStores } from './test-variables';

const variableRegex = () => /{([A-Z]+):([^}]+)}/g;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceMatchGlobally(string, match, replace, options = 'g') {
    return string.replace(new RegExp(escapeRegExp(match), options), replace);
}

// function envReplacer(inputStr, replaceStr, envPath) {
//     // const env = Cypress.env('envFile')
//     // cy.log(` env - ${env}`)
//     const val = envPath.split('.').reduce((objOrValue, part) => {
//         if (typeof objOrValue === 'string') {
//             return objOrValue;
//         }
//         return objOrValue[part] || '';
//     }, env);
//     return replaceMatchGlobally(inputStr, replaceStr, val);
// }

function dateReplacer(inputStr, replaceStr, dateType) {
    let val = '';
    const now = new Date();
    switch (dateType) {
        case 'WeekAgo':
            now.setDate(now.getDate() - 7);
            val = now.toISOString();
            break;
        case '3daysAgo':
            now.setDate(now.getDate() - 3);
            val = now.toISOString();
            break;
        default:
            val = now.toISOString();
    }
    return replaceMatchGlobally(inputStr, replaceStr, val);
}

function variableStoreReplacer(storeType, inputStr, replaceStr, path) {
    const { scenarioStore, featureStore } = getStores();
    const store = storeType === 'scenarioStore' ? scenarioStore : featureStore;
    const val = path.split('.').reduce((objOrValue, part) => {
        if (objOrValue === null) {
            return null;
        }
        return objOrValue[part] || null;
    }, store);
    if (val === null) {
        throw new Error(`${replaceStr} not found`);
    }
    return replaceMatchGlobally(inputStr, replaceStr, val);
}

function fileStreamReplacer(targetStr, replaceStr, value) {
    if (targetStr !== replaceStr) {
        throw new Error('Unable to insert stream into a string');
    }
    return createReadStream(value);
}

// Numbers and letters only. ShortID has symbols
function getShortId() {
    return generate().replace(/_/g, 'aa').replace(/-/g, 'bb');
}

// Generated only on the first require of this module
const testId = getShortId();

function testIdReplacer(inputStr, replaceStr) {
    return replaceMatchGlobally(inputStr, replaceStr, testId);
}

export default class GlobalStorage {
    // Parse a string looking like '{ENV:foo}' => { type: ENV, value: foo }
    static parseVariable(variableStr) {
        const regex = variableRegex();
        const [fullMatch, type, variable] = regex.exec(variableStr) || [];
        return fullMatch ? { type, variable } : null;
    }

    static storeVariable(variableStr, value) {
        const { type, variable } = GlobalStorage.parseVariable(variableStr) || {
            type: 'S',
            variable: variableStr,
        };
        if (!type) {
            throw new Error(
                `Unable to store variable with name ${variableStr}`
            );
        }
        const { scenarioStore, featureStore } = getStores();
        if (type === 'S' || type === 'SCENARIO') {
            scenarioStore[variable] = value;
        } else if (type === 'F' || type === 'FEATURE') {
            featureStore[variable] = value;
        }
    }

    static storeVariables(variableStr, values, separator) {
        const varArray = variableStr.split(separator);
        const varValueArray = values.split(separator);
        for (let index = 0; index < varArray.length; index += 1) {
            GlobalStorage.storeVariable(varArray[index], varValueArray[index]);
        }
    }

    static getStoredVariable(variableStr) {
        let result = null;
        const { type, variable } = GlobalStorage.parseVariable(variableStr) || {
            type: 'S',
            variable: variableStr,
        };
        if (!type) {
            throw new Error(
                `Unable to store variable with name ${variableStr}`
            );
        }
        const { scenarioStore, featureStore } = getStores();
        if (type === 'S' || type === 'SCENARIO') {
            result = scenarioStore[variable];
        } else if (type === 'F' || type === 'FEATURE') {
            result = featureStore[variable];
        }
        return result;
    }

    // Replace matching templates in a string with dynamic values
    // e.g. https://{Env:url}/quotes/{S:quoteId}
    static replaceVariables(input) {
        const regex = variableRegex();
        let match;
        const variables = {};
        while ((match = regex.exec(input)) != null) {
            // eslint-disable-line
            const [fullMatch, replaceType, replaceVal] = match;
            variables[fullMatch] = { fullMatch, replaceType, replaceVal };
        }
        const updatedStr = Object.keys(variables).reduce(
            (textToUpdate, key) => {
                const { fullMatch, replaceType, replaceVal } = variables[key];
                switch (replaceType) {                    
                    case 'SHORTID':
                        return replaceMatchGlobally(
                            textToUpdate,
                            fullMatch,
                            getShortId()
                        );                    
                    case 'F':
                    case 'FEATURE':
                        return variableStoreReplacer(
                            'featureStore',
                            textToUpdate,
                            fullMatch,
                            replaceVal
                        );
                    case 'S':
                    case 'SCENARIO':
                        return variableStoreReplacer(
                            'scenarioStore',
                            textToUpdate,
                            fullMatch,
                            replaceVal
                        );
                    case 'STREAM':
                        return fileStreamReplacer(
                            textToUpdate,
                            fullMatch,
                            replaceVal
                        );
                    case 'TESTID':
                        return testIdReplacer(
                            textToUpdate,
                            fullMatch,
                            replaceVal
                        );
                    default:
                        return textToUpdate;
                }
            },
            input
        );
        return updatedStr;
    }

    static replaceVariablesInObject(obj) {
        const objectAsString = JSON.stringify(obj);
        const replacedVarsInSring =
            GlobalStorage.replaceVariables(objectAsString);
        return JSON.parse(replacedVarsInSring);
    }

    static get testId() {
        return testId;
    }
}

