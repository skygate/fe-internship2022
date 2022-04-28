import { ListingItem } from '../types';
import styles from './productCard.module.scss';
import { ProfilePicture } from '..';
import { GreenETHValue } from 'components/greenETHValue/GreenETHValue';
import Heart from '../../assets/Heart.svg';

interface ProductCardProps {
	item: ListingItem;
}

export const ProductCard = ({ item }: ProductCardProps) => {
	return (
		<div className={styles.productCardContainer}>
			<div className={styles.nftImageWrapper}>
				<img
					src={item.productImageUrl}
					alt={item.productName}
					className={styles.nftImage}
				/>
				<div className={styles.imageHoverSection}>
					<div className={styles.imageHoverContainer}>
						<div className={styles.purchasingAndIcon}>
							<span className={styles.purchasing}>PURCHASING !</span>
							<button type="button" className={styles.iconContainer}>
								<img src={Heart} className={styles.heartIcon} alt="heart" />
							</button>
						</div>
						<div className={styles.placeBidContainer}>
							<button type="button" className={styles.placeBidButton}>
								<span>Place a bid</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.titleAndPrice}>
				<span className={styles.nftTitle}>{item.productName}</span>
				<span className={styles.nftPrice}>
					<GreenETHValue ETHValue={item.price} />
				</span>
			</div>
			<div className={styles.avatarsAndUnits}>
				<div className={styles.avatars}>
					<div className={styles.avatar}>
						<ProfilePicture url={item.productImageUrl} width={'24px'} />
					</div>
					<div className={styles.avatar}>
						<ProfilePicture url={item.productImageUrl} width={'24px'} />
					</div>
					<div className={styles.avatar}>
						<ProfilePicture url={item.productImageUrl} width={'24px'} />
					</div>
					{/* replace it with other prop (for example bidding people?) */}
				</div>
				<span className={styles.unitsInStock}>{item.amount} in stock</span>
			</div>
			<div className={styles.bidSection}>
				<span className={styles.highestBid}>
					Highest bid{' '}
					<span className={styles.highestBidValue}>{item.price} ETH</span>
				</span>
				<span className={styles.newBid}>new bid 🔥</span>
			</div>
		</div>
	);
};
