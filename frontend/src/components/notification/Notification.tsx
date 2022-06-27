import styles from "./notification.module.scss";
import { NotificationObject } from "interfaces";
import { intervalToDuration, Interval } from "date-fns";
import arrow from "assets/arrowRight.svg";
import { Link } from "react-router-dom";

interface NotificationProps {
    object: NotificationObject;
}

export const Notification = ({ object }: NotificationProps) => {
    const returnTimeInterval = () => {
        const interval: Interval = {
            start: new Date(object.date),
            end: new Date(),
        };
        const date = intervalToDuration(interval);
        if (date.days === 0 && date.hours === 0) return `${date.minutes} minutes ago`;
        if (date.days === 0) return `${date.hours} hours ago`;
        return `${date.days} days ago`;
    };

    return (
        <Link to={object.objectURL}>
            <div className={styles.notification}>
                <div className={styles.wrapper}>
                    <img src={object.imageURL} alt="object image" className={styles.img} />

                    <div>
                        <p className={styles.title}>{object.title}</p>
                        <p className={styles.message}>{object.message}</p>
                        <p className={styles.time}>{returnTimeInterval()}</p>
                    </div>
                </div>
                <div className={styles.action}>
                    <img src={arrow} alt="go to action" />
                </div>
            </div>
        </Link>
    );
};
