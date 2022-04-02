import ky from "ky";
import type { FlatHubAppstreamResponse, SearchData } from "../types/flathub";

export const client = ky.create({'prefixUrl': 'https://flathub-stats-backend.vercel.app'})
export const flathubClient = ky.create({'prefixUrl': 'https://flathub.org/api/v2'})

export interface HistoryElement {
    name: string;
    icon: string;
    appstream: { name: string };
    url: string;
    history_sum: {
        'u': number;
        'i': number;
    };
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

export interface AppData {
    name: string;
    icon: string;
    url: string;
    appstream: FlatHubAppstreamResponse;
}

export interface AppDetailElement extends AppData {
    history_sum: {
        'u': number;
        'i': number;
    };
    history: {
        [key: string]: {
            total: { i: number, u: number }
            arches: {
                [key: string]: { i: number, u: number }
            }
        };
    };
}

export function getLastMonth(): Promise<HistoryElement[]> {
    return client.get('last_30_days.json').json()
}

export function getAppDetails(appId: string): Promise<AppDetailElement> {
    return client.get(`app_history/${appId.replaceAll('/', '_')}.json`).json()
}

export function getAppData(appId: string): Promise<AppData> {
    return client.get(`app_data/${appId.replaceAll('/', '_')}.json`).json()
}

let searchData: SearchData[] | undefined = undefined;
export async function searchApp(query: string): Promise<SearchData[]>{
    if (!searchData) {
        searchData = await client.get('search_data.json').json()
    }

    let results: {[key: string]: SearchData} = {}

    //@ts-ignore
    for (const data of searchData) {
        const found = data.query.includes(query);
        if (found && !results[data.app_id]) {
            results[data.app_id] = data
        }
    }

    return Object.values(results);
}

