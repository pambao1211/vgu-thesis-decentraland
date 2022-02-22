import { useSelector } from "react-redux";
import { Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import LandListItem from "../../../components/pages/lands/overview/LandListItem";
import Empty from "../../../components/commons/Empty";

const LandsOverview = () => {
    const router = useRouter();
    const lands = useSelector((state) =>
        Object.values(state.landReducer.lands)
    );
    const renderedLands = () => {
        return (
            <Stack w="100%" spacing={3}>
                {lands.map((land) => {
                    return <LandListItem key={land.id} land={land} />;
                })}
            </Stack>
        );
    };
    return (
        <>
            {lands.length === 0 ? (
                <Empty
                    message="There is no land uploaded yet"
                    action={{
                        title: "Add Land",
                        action: () => {
                            router.push("/lands/add");
                        },
                    }}
                />
            ) : (
                renderedLands()
            )}
        </>
    );
};

export default LandsOverview;
