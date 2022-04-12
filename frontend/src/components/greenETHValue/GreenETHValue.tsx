import { FC } from "react";
import styles from "./GreenETHValue.module.scss";

interface ETHValueProp {
    ETHValue: number;
}

export const GreenETHValue: FC<ETHValueProp> = ({ ETHValue }) => {
    return <span className={styles.ETHValue}>{ETHValue} ETH</span>;
};
export default GreenETHValue;
