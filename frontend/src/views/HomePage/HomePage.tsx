import { Banner } from 'components';
import { CreatorNetwork } from './';
import { TopBrandsView } from './';
import { Popular } from './';
import { Discover } from './';
import { HotBid } from './';
import { HotCollections } from './';

export const HomePage = () => {
	const showData = () => {
		fetch('http://localhost:8000/nfts')
			.then((response) => response.json())
			.then((res) => console.log(res));
	};
	return (
		<>
			{showData()}
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
