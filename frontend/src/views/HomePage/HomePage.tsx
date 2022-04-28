import { Banner } from "components";
import { CreatorNetwork } from "./";
import { TopBrandsView } from "./";
import { Popular } from "./";
import { Discover } from "./";
import { HotBid } from "./";
import { HotCollections } from "./";

export const HomePage = () => {
    return (
        <>
            <Banner />
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <HotCollections />
            <Discover />
        </>
    );
};
