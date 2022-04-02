import ky from "ky";
import type { FlatHubAppstreamResponse } from "../types/flathub";

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

export interface AppDetailElement {
    name: string;
    icon: string;
    url: string;
    appstream: FlatHubAppstreamResponse;
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

export function getAppstramDetails(appId: string): Promise<FlatHubAppstreamResponse>{
    return flathubClient.get(`appstream/${appId}`).json()
}