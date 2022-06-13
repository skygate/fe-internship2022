import { useEffect } from "react";

export function useOutsideAlerter(
    ref: any,
    setActiveDropdownButton: React.Dispatch<React.SetStateAction<boolean>>
) {
    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setActiveDropdownButton(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
