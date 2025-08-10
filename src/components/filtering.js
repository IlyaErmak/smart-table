export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const items = indexes[elementName] ? Object.values(indexes[elementName]) : [];
            elements[elementName].append(...items.map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }));
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    input.value = '';
                    const field = action.dataset.field;
                    if (field && state[field] !== undefined) {
                        state[field] = '';
                    }
                }
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}