import React, { useEffect, useState } from 'react';
import { DiscoverView } from './DiscoverView';

const PRICE_GAP = 20;
const PRICE_RANGE_DEFAULT = 300;

const initialStyle = {
	background: `linear-gradient(to right, #E6E8EC 0% , #3772ff 0% , #3772ff 100%, #E6E8EC 100%)`,
};

const PRODUCTS_DATA_URL = 'http://localhost:8000/listing/fullInfo';

export const Discover = () => {
	const [priceRangeMin, setPriceRangeMin] = useState(0);
	const [priceRangeMax, setPriceRangeMax] = useState(PRICE_RANGE_DEFAULT);
	const [priceRangeStyle, setPriceRangeStyle] = useState(initialStyle);
	const [productsData, setProductsData] = useState();

	const fetchProductsData = (url: string) => {
		fetch(url)
			.then((res) => res.json())
			.then((data) => setProductsData(data));
		// .then((data) => console.log(data));
	};

	useEffect(() => {
		fetchProductsData(PRODUCTS_DATA_URL);
	}, []);

	const calculatePercentage = (nominator: number, denominator: number) =>
		(nominator / denominator) * 100;

	const setPriceRangeBackground = (percent1: number, percent2: number) =>
		setPriceRangeStyle({
			background: `linear-gradient(to right, #E6E8EC ${percent1}% , #3772ff ${percent1}% , #3772ff ${percent2}%, #E6E8EC ${percent2}%)`,
		});

	const fillColor = () => {
		const percent1 = calculatePercentage(priceRangeMin, PRICE_RANGE_DEFAULT);
		const percent2 = calculatePercentage(priceRangeMax, PRICE_RANGE_DEFAULT);
		setPriceRangeBackground(percent1, percent2);
	};

	const checkGap = (priceMin: number, priceMax: number, gap: number) =>
		priceMax - priceMin >= gap ? true : false;

	const onMinPriceRangeChange = (e: React.ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		checkGap(priceRangeMin, priceRangeMax, PRICE_GAP)
			? setPriceRangeMin(Number(target.value))
			: setPriceRangeMin(priceRangeMax - PRICE_GAP);
		fillColor();
	};

	const onMaxPriceRangeChange = (e: React.ChangeEvent) => {
		const target = e.target as HTMLInputElement;

		checkGap(priceRangeMin, priceRangeMax, PRICE_GAP)
			? setPriceRangeMax(Number(target.value))
			: setPriceRangeMax(priceRangeMin + PRICE_GAP);

		fillColor();
	};

	return (
		<DiscoverView
			onMinPriceRangeChange={onMinPriceRangeChange}
			onMaxPriceRangeChange={onMaxPriceRangeChange}
			priceRangeStyle={priceRangeStyle}
			priceRangeMin={priceRangeMin}
			priceRangeMax={priceRangeMax}
			priceRangeDefault={PRICE_RANGE_DEFAULT}
			productsData={productsData}
		/>
	);
};
