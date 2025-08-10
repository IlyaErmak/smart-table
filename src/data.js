const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id] || 'Неизвестно',
        customer: customers[item.customer_id] || 'Неизвестно',
        total: item.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            const [sellersRaw, customersRaw] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json())
            ]);

            const sellersData = sellersRaw.items || sellersRaw;
            const customersData = customersRaw.items || customersRaw;

            sellers = sellersData.reduce((acc, item) => {
                acc[item.id] = `${item.first_name} ${item.last_name}`;
                return acc;
            }, {});

            customers = customersData.reduce((acc, item) => {
                acc[item.id] = `${item.first_name} ${item.last_name}`;
                return acc;
            }, {});
        }
        return { sellers, customers };
    };

    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated && lastResult) {
            return lastResult;
        }

        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}