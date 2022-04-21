import { Banner } from "components";
import { CreatorNetwork } from "./";
import { TopBrandsView } from "./";
import { Popular } from "./";
import { Discover } from "./";
import { HotBid } from "./";
import { HotCollections } from "./";
import { useStateContext } from "state/StateContext";

export const HomePage = () => {
    const { activeAccount } = useStateContext();

    return (
        <>
            <Banner />
            <span>{activeAccount}</span>
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <HotCollections />
            <Discover />
        </>
    );
};
