import axiosInstance from "services/axios";

export const fetchAuctions = () => {
    return axiosInstance.get("/auctions?full=true");
};
