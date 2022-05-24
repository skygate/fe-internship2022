import axiosInstance from "services/axios";

export const fetchAuctions = () => {
    return axiosInstance.get("/auctions?full=true");
};

export const fetchFilteredAndSortedAuctions = (params: any) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const timeFilter = urlParams.get("time") || "ever";
    const sortBy = urlParams.get("sortBy") || "startDate";
    const ascending = urlParams.get("ascending") || "1";
    const category = urlParams.get("category") || "all";
    const priceMin = urlParams.get("priceMin") || 0;
    const priceMax = urlParams.get("priceMax") || 2000;

    const url = `/auctions?filter=true&time=${timeFilter}&category=${category}&priceMin=${priceMin}&priceMax=${priceMax}&sort=${sortBy}&asc=${ascending}`;
    return axiosInstance.get(url);
};
