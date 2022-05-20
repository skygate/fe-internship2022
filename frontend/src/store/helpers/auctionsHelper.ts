import axiosInstance from "services/axios";

export const fetchAuctions = () => {
    return axiosInstance.get("/auctions?full=true");
};

export const fetchFilteredAndSortedAuctions = (params: any) => {
    const data = params;
    const timeFilter = data.filter.time;
    const sortBy = data.sort.sortBy;
    const ascending = data.sort.ascending;
    const category = data.filter.category || null;
    const priceMin = data.filter.priceMin;
    const priceMax = data.filter.priceMax;

    const url = `/auctions?filter=true&time=${timeFilter}&category=${category}&priceMin=${priceMin}&priceMax=${priceMax}&sort=${sortBy}&asc=${ascending}`;
    console.log(url);
    return axiosInstance.get(url);
};
