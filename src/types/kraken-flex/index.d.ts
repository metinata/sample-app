declare interface Outage {
    id: string;
    begin: Date;
    end: Date;
}

declare interface Device {
    id: string;
    name: string;
}

declare interface SiteInfo {
    id: string;
    name: string;
    devices: Device[];
}

declare interface SiteOutage {
    id: string;
    name: string;
    begin: Date;
    end: Date;
}

declare interface KrakenFlexApiCache {
    [key: string]: unknown | Type;
}
