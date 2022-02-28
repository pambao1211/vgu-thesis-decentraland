import { useSelector } from "react-redux";
import { Button, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import LandListItem from "../../../components/pages/lands/overview/LandListItem";
import Empty from "../../../components/commons/Empty";
import { PRIMARY_COLOR } from "../../../configs";

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
                    component={
                        <Button
                            colorScheme={PRIMARY_COLOR}
                            onClick={() => {
                                router.push("/lands/add");
                            }}
                        >
                            Add Land
                        </Button>
                    }
                />
            ) : (
                renderedLands()
            )}
        </>
    );
};

export default LandsOverview;
