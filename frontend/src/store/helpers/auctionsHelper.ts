import axiosInstance from "services/axios";

export const fetchAuctions = (id?: string) => {
    if (id) return axiosInstance.get(`/auctions?full=true&id=${id}`);
    return axiosInstance.get("/auctions?full=true");
};

export const fetchFilteredAndSortedAuctions = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const defaultParams = {
        time: "ever",
        sort: "startDate",
        ascending: "1",
        category: "all",
        priceMin: "0",
        priceMax: "2000",
    };

    const searchParams = new URLSearchParams(defaultParams);

    for (const [name, value] of urlParams) {
        if (Object.keys(defaultParams).includes(name)) {
            searchParams.set(name, value);
        }
    }

    const url = `/auctions?filter=true&${searchParams}`;
    return axiosInstance.get(url);
};
