import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

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
function render(action) {
    const state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
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

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers  
});

const applyPagination = initPagination(
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

render();