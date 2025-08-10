import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";

let api;
let indexes;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const formData = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(formData.rowsPerPage);
    const page = parseInt(formData.page ?? 1);

    return {
        ...formData,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    const state = collectState(); // состояние полей из таблицы
    let query = {};

    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    query = applySearching(query, state, action);

    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'],
    after: ['pagination']
}, render);

const applySorting = initSorting([ 
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]); 

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements, {
    searchBySeller: null
});

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,             
    (el, page, isCurrent) => {                    
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    api = await initData();
    indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });

    applyFiltering.searchBySeller = indexes.sellers;
}

init().then(() => render());