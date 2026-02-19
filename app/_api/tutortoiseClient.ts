// Make calls to the same origin to route requests through the proxy
const BALANCE_ENDPOINT = '/api/credits/balance/{id}';
const TRANSACTION_HISTORY_ENDPOINT = '/api/credits/history/{id}';
<<<<<<< HEAD
const BUY_CREDITS_ENDPOINT = '/api/credits/buy?parentId={parentId}&credits={credits}&amount={amount}';
=======
>>>>>>> 9305f42f4aba5368be6604b2a30ae2d0c19f01e1

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
<<<<<<< HEAD
    },

    buyCredits: async (id: string, credits: number, amount: number): Promise<any> => {
        return await fetch(TutortoiseClient.getBasePath() + BUY_CREDITS_ENDPOINT
            .replace('{parentId}', id)
            .replace('{credits}', String(credits))
            .replace('{amount}', String(amount)),
            {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'content-type': 'text/plain'
                }
            }
        )
        .then(res => res.text())
        .catch(err => console.error('Buy credits API call failed', err));
    },
=======
    }
>>>>>>> 9305f42f4aba5368be6604b2a30ae2d0c19f01e1
};