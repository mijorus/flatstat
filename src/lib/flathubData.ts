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

export type SummaryElement = Omit<HistoryElement, 'history'>

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

function getAppId(str: string) {
    return encodeURIComponent(encodeURIComponent(str));
}

export function getLastMonth(): Promise<SummaryElement[]> {
    return client.get('last_30_days.json').json()
}

export function getLibrariesSummary(): Promise<SummaryElement[]> {
    return client.get('libraries_summary.json').json()
}

export function allTime(): Promise<SummaryElement[]> {
    return client.get('all_time.json').json()
}

export function getAppDetails(appId: string): Promise<AppDetailElement> {
    return client.get(`app_history/${getAppId(appId)}.json`).json()
}

export function getAppData(appId: string): Promise<AppData> {
    return client.get(`app_data/${getAppId(appId)}.json`).json()
}

export function getAppReviews(appId: string): Promise<AppData> {
    return client.get(`app_reviews/${getAppId(appId)}.json`).json()
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
    return `https://dl.flathub.org/repo/appstream/x86_64/icons/128x128/${getAppId(appId)}.png`
}

export function getShieldIoBadgeDataUrl(appId: string): string {
    return `https://img.shields.io/endpoint?url=${backendBaseUrl}/badges/${getAppId(appId)}/shields.io.json`;
}

export function getMarkdownShieldIoBadgeDataUrl(appId: string): string {
    return `<p align="center"><a href="https://flatstat.mijorus.it/app/${appId}"  align="center"><img width="150" src="${getShieldIoBadgeDataUrl(appId)}"></a></p>`;
}