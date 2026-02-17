// Make calls to the same origin to route requests through the proxy
const BALANCE_ENDPOINT = '/api/credits/balance/{id}';
const TRANSACTION_HISTORY_ENDPOINT = '/api/credits/history/{id}';

export const TutortoiseClient = {
    getBasePath: () => window.location.origin,
    getBalance: async (id: string): Promise<number> => {
        return await fetch(TutortoiseClient.getBasePath() + BALANCE_ENDPOINT.replace('{id}', id), {
            headers: {
                // 'accept': 'application/json',
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(err => console.error('Balance API call failed:', err));
    },

    getTransactionHistory: async (id: string): Promise<any> => {
        return await fetch(TutortoiseClient.getBasePath() + TRANSACTION_HISTORY_ENDPOINT.replace('{id}', id))
        .then(res => res.json())
        .catch(err => console.error('Transaction History API call failed'));
    }
};