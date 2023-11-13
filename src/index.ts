import * as dotenv from "dotenv";
dotenv.config();

import { krakenFlexApi } from "./services";

const main = async (): Promise<void> => {
    const dateFilter = new Date(`${process.env.DATE_FILTER}`);

    console.info("Process has been started.");
    console.info("Fetching data...");

    //Fetch the data simultaneously
    const [outages, norwich] = await Promise.all([
        krakenFlexApi.getOutages(),
        krakenFlexApi.getSiteInfo(`${process.env.SITE_ID}`),
    ]);

    console.info("%s Outage(s) was found.", outages.length);
    console.info("Data received for %s.", process.env.SITE_ID);

    //Filter the data in a single iteration
    const filteredOutages = outages.reduce(
        (result: SiteOutage[], outage: Outage): SiteOutage[] => {
            if (outage.begin >= dateFilter) {
                const device = norwich.devices.find((d) => d.id === outage.id);
                if (device) {
                    result.push({ name: device.name, ...outage });
                }
            }

            return result;
        },
        []
    );

    console.info(
        "%s Record(s) filtered for %s.",
        filteredOutages.length,
        process.env.SITE_ID
    );

    if (filteredOutages.length) {
        await krakenFlexApi.createSiteOutage(
            `${process.env.SITE_ID}`,
            filteredOutages
        );
        console.info(
            "Outage data was successfully posted for %s.",
            process.env.SITE_ID
        );
    }

    console.info("Exit.");
};

main();
