import React from "react";
import styles from "./footer.module.scss";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const footerLinks = ["Sign in", "Latest changes", "For creators"];

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <span className={styles.title}>SkyNFT Marketplace</span>
                <div className={styles.footerLinksContainer}>
                    {footerLinks.map((element) => (
                        <a key={element} href="/" className={styles.footerLinks}>
                            {element}
                        </a>
                    ))}
                </div>
            </div>
            <div className={styles.footerDescription}>
                <span className={styles.copyright}>
                    Copyright © {currentYear} EDIT IT EDIT IT All rights reserved
                </span>
                <div>
                    <span className={styles.cookies}>We use cookies for better service.</span>
                    <a href="/" className={styles.cookiesAcceptLink}>
                        Accept
                    </a>
                </div>
            </div>
        </footer>
    );
}
