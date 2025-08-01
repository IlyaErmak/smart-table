import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchElement, searchField) {
    const compare = createComparison([
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    return (data, state, action) => {
        return data.filter(row => compare(row, state));
    };
}