import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = `BlogApp | ${title}`;
    }, [title]);
};

export default usePageTitle;
