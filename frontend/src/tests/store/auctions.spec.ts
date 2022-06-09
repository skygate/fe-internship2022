import { store } from "store/store";
import { getAuctions } from "store/auctions";

const mockFetchAuctions = jest.fn();
const mockFetchFilteredAndSortedAuctions = jest.fn();

jest.mock("store/helpers/auctionsHelper", () => ({
    fetchAuctions: () => mockFetchAuctions(),
    fetchFilteredAndSortedAuctions(...args: unknown[]) {
        return mockFetchFilteredAndSortedAuctions(...args);
    },
}));

const initialState = {
    status: "",
    auctions: [],
};

const fakeAuctions = [{ id: 1 }, { id: 2 }];

const getState = () => store.getState().auctions;

describe("store/auctions.ts", () => {
    it("should set initial state", () => {
        expect(getState()).toStrictEqual(initialState);
    });

    it("should set unfiltered and unsorted auctions when flag is false", async () => {
        mockFetchAuctions.mockResolvedValueOnce(Promise.resolve({ data: [...fakeAuctions] }));
        await store.dispatch(getAuctions(false));
        expect(mockFetchAuctions).toHaveBeenCalled();
        expect(getState()).toStrictEqual({ status: "success", auctions: [...fakeAuctions] });
    });

    it("should set filtered and sorted auctions when flag is true", async () => {
        mockFetchFilteredAndSortedAuctions.mockResolvedValueOnce(
            Promise.resolve({ data: [...fakeAuctions] })
        );
        await store.dispatch(getAuctions(true));
        expect(mockFetchFilteredAndSortedAuctions).toHaveBeenCalledWith(true);
        expect(getState()).toStrictEqual({ status: "success", auctions: [...fakeAuctions] });
    });

    it("shouls set an empty array when fetch fails", async () => {
        mockFetchFilteredAndSortedAuctions.mockImplementationOnce(() =>
            Promise.reject("some error")
        );
        await store.dispatch(getAuctions(true));
        expect(mockFetchFilteredAndSortedAuctions).toHaveBeenCalled();
        expect(getState()).toStrictEqual({ status: "failed", auctions: [] });
    });
});
