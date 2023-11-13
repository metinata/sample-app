import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
});

axios.defaults.baseURL = process.env.API_BASE_URL;

axios.interceptors.request.use((config) => {
    config.headers["X-Api-Key"] = process.env.API_KEY;
    return config;
});

const krakenFlexAPiCache: KrakenFlexApiCache = {
    outages: [],
};

const krakenFlexApi = {
    getOutages: async (): Promise<Outage[]> => {
        try {
            // We can cache the response.
            // if(krakenFlexAPiCache.outages.length) {
            //     return krakenFlexAPiCache.outages;
            // }

            const response = await axios.get("/outages");

            // Casting string to date
            response.data.forEach((outage: Outage) => {
                outage.begin = new Date(outage.begin);
                outage.end = new Date(outage.end);
            });

            krakenFlexAPiCache.outages = response.data;

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            } else {
                throw error;
            }
        }
    },
    getSiteInfo: async (siteId: string): Promise<SiteInfo> => {
        try {
            const response = await axios.get(`/site-info/${siteId}`);

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            } else {
                throw error;
            }
        }
    },
    createSiteOutage: async (
        siteId: string,
        outages: SiteOutage[]
    ): Promise<void> => {
        try {
            await axios.post(`/site-outages/${siteId}`, outages);
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            } else {
                throw error;
            }
        }
    },
};

export default krakenFlexApi;
