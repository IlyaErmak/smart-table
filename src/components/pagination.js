import {getPages} from "../lib/utils.js";

let pageCount;

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // обработка действий пагинации (перенос из @todo: #2.6)
        if (action) switch (action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount || 1, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount || 1; break;
            default:
                if (typeof action.page === 'number') {
                    page = action.page;
                }
                break;
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // отрисовка списка страниц (перенос из @todo: #2.4)
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // вывод статуса пагинации (перенос из @todo: #2.5, с заменой rowsPerPage на limit)
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return {
        updatePagination,
        applyPagination
    };
}