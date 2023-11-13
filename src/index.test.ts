import axios from "axios";
import { krakenFlexApi } from "./services";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("krakenFlexApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getOutages", () => {
        it("should fetch outages successfully", async () => {
            const expectedOutages = [
                {
                    id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
                    begin: new Date("2022-01-01T00:00:00Z"),
                    end: new Date("2022-01-02T00:00:00Z"),
                },
            ];

            const response = { data: expectedOutages };
            mockedAxios.get.mockResolvedValue(response);

            const outages = await krakenFlexApi.getOutages();

            expect(outages).toEqual(expectedOutages);
            expect(axios.get).toHaveBeenCalledWith("/outages");
        });

        it("should throw an error when fetching outages fails", async () => {
            const errorMessage = "Failed to fetch outages";
            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            await expect(krakenFlexApi.getOutages()).rejects.toThrow(
                errorMessage
            );
            expect(axios.get).toHaveBeenCalledWith("/outages");
        });
    });

    describe("getSiteInfo", () => {
        it("should fetch site info successfully", async () => {
            const siteId = "norwich-pear-tree";
            const expectedSiteInfo = { id: siteId, name: "Norwich Pear Tree" };

            const response = { data: expectedSiteInfo };
            mockedAxios.get.mockResolvedValue(response);

            const siteInfo = await krakenFlexApi.getSiteInfo(siteId);

            expect(siteInfo).toEqual(expectedSiteInfo);
            expect(axios.get).toHaveBeenCalledWith(`/site-info/${siteId}`);
        });

        it("should throw an error when fetching site info fails", async () => {
            const siteId = "pear-tree";
            const errorMessage = "Failed to fetch site info";
            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            await expect(krakenFlexApi.getSiteInfo(siteId)).rejects.toThrow(
                errorMessage
            );
            expect(axios.get).toHaveBeenCalledWith(`/site-info/${siteId}`);
        });
    });

    describe("createSiteOutage", () => {
        it("should create site outage successfully", async () => {
            const siteId = "norwich-pear-tree";
            const outages = [
                {
                    id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
                    name: "Battery 1",
                    begin: new Date("2022-01-01T00:00:00Z"),
                    end: new Date("2022-01-02T00:00:00Z"),
                },
            ];

            await krakenFlexApi.createSiteOutage(siteId, outages);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `/site-outages/${siteId}`,
                outages
            );
        });

        it("should throw an error when creating site outage fails", async () => {
            const siteId = "norwich-pear-tree";
            const outages = [
                {
                    id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
                    name: "Battery 1",
                    begin: new Date("2022-01-01T00:00:00Z"),
                    end: new Date("2022-01-02T00:00:00Z"),
                },
            ];
            const errorMessage = "Failed to create site outage";
            mockedAxios.post.mockRejectedValue(new Error(errorMessage));

            await expect(
                krakenFlexApi.createSiteOutage(siteId, outages)
            ).rejects.toThrow(errorMessage);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                `/site-outages/${siteId}`,
                outages
            );
        });
    });
});
