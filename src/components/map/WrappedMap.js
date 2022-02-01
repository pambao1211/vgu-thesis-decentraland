import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapWithNoSSR = dynamic(() => import("./Map"), {
    ssr: false,
});

const WrappedMap = () => {
    return <MapWithNoSSR />;
};

export default WrappedMap;
