import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import CitizenListItemContent from "../../../commons/CitizenListItemContent";
import { BOX_BORDER_COLOR, PRIMARY_COLOR } from "../../../../configs";

const CitizenListItem = ({ citizen }) => {
    const router = useRouter();
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={5}
            borderWidth={1}
            borderColor={BOX_BORDER_COLOR}
            borderRadius="md"
            shadow="md"
        >
            <CitizenListItemContent citizen={citizen} />
            <Button
                colorScheme={PRIMARY_COLOR}
                onClick={(e) => {
                    router.push(`/citizens/overview/${citizen.id}`);
                }}
            >
                View Profile
            </Button>
        </Flex>
    );
};

export default CitizenListItem;
