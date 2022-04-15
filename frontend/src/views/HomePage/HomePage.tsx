import { Navbar } from "../../components";
import { Banner } from "../../components";
import { CreatorNetwork } from "./";
import { TopBrandsView } from "./";
import { Popular } from "./";
import { Discover } from "./";
import { HotBid } from "./";
import { HotCollections } from "./";
import { Footer } from "../../components";

export const HomePage = () => {
    return (
        <>
            <Navbar />
            <Banner />
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <HotCollections />
            <Discover />
            <Footer />
        </>
    );
};
