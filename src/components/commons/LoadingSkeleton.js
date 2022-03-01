import { Stack, Skeleton } from "@chakra-ui/react";
import React from "react";

const customSkeleton = (
    <Skeleton h="25px" w="100%">
        <div style={{ height: "100%", width: "100%" }} />
    </Skeleton>
);

const LoadingSkeleton = ({ numberSkeleton }) => {
    return (
        <Stack w="100%">
            {new Array(numberSkeleton).fill(0).map((_, i) => (
                <React.Fragment key={i}> {customSkeleton}</React.Fragment>
            ))}
        </Stack>
    );
};

export default LoadingSkeleton;
