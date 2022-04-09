import ky from "ky";
import type { FlatHubAppstreamResponse, SearchData } from "../types/flathub";
import { ShieldIOBadgeData } from "../types/shields.io";

const backendBaseUrl = 'https://flathub-stats-backend.vercel.app';
export const client = ky.create({'prefixUrl': backendBaseUrl})
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
        date: string
        total: { i: number, u: number }
        arches: {
            [key: string]: { i: number, u: number }
        }
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
        date: string;
        total: { i: number, u: number }
        arches: {
            [key: string]: { i: number, u: number }
        }
    }[];
}

export function getLastMonth(): Promise<HistoryElement[]> {
    return client.get('last_30_days.json').json()
}

export function getAppDetails(appId: string): Promise<AppDetailElement> {
    return client.get(`app_history/${encodeURIComponent(appId)}.json`).json()
}

export function getAppData(appId: string): Promise<AppData> {
    return client.get(`app_data/${encodeURIComponent(appId)}.json`).json()
}

let searchData: SearchData[] | undefined = undefined;
export async function searchApp(query: string): Promise<SearchData[]>{
    if (!searchData) {
        searchData = await client.get('search_data.json').json()
    }

    let results: {[key: string]: SearchData} = {}

    //@ts-ignore
    for (const data of searchData) {
        const found = data.query.toLowerCase().includes(query.toLowerCase());
        if (found && !results[data.app_id]) {
            results[data.app_id] = data
        }
    }

    return Object.values(results);
}

export function getAppIconUrl(appId: string) {
    return `https://dl.flathub.org/repo/appstream/x86_64/icons/128x128/${encodeURIComponent(appId)}.png`
}

export function getShieldIoBadgeDataUrl(appId: string): string {
    return `https://img.shields.io/endpoint?url=${backendBaseUrl}/badges/${encodeURIComponent(appId)}/shields.io.json`;
}