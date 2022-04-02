export interface FlatHubAppstreamResponse {
    description: string;
    screenshots: Screenshot[];
    releases: Release[];
    content_rating: Contentrating;
    urls: Urls;
    icon: string;
    id: string;
    name: string;
    summary: string;
    categories: string[];
    keywords: string[];
    kudos: string[];
    project_license: string;
    launchable: Launchable;
    developer_name?: string;
    bundle: Bundle;
}

interface Bundle {
    value: string;
    type: string;
    runtime: string;
    sdk: string;
}

interface Launchable {
    value: string;
    type: string;
}

interface Urls {
    homepage: string;
}

interface Contentrating {
    type: string;
}

interface Release {
    type: string;
    timestamp: string;
    version: string;
    description: string;
}

interface Screenshot {
    '624x351': string;
    '112x63': string;
    '224x126': string;
    '752x423': string;
}