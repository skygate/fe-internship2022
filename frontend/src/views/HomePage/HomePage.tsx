import { Banner } from "components";
import { CreatorNetwork } from "./";
import { TopBrandsView } from "./";
import { Popular } from "./";
import { Discover } from "./";
import { HotBid } from "./";

export const HomePage = () => {
    return (
        <>
            <Banner />
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <Discover />
        </>
    );
};
