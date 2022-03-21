import ky from "ky";

export const client = ky.create({'prefixUrl': 'https://flathub-stats-backend.vercel.app'})

export interface LastMonthHistory {
    name: string;
    history: {
        [key: string]: {
            [key: string]: {
                total: { i: number, u: number }
                arches: {
                    [key: string]: { i: number, u: number }
                }
            };
        };
    };
}

export async function getLastMonth(): Promise<LastMonthHistory[]> {
    return await client.get('last_30_days.json').json()
}