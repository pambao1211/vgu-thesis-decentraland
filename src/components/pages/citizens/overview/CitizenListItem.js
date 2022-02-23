import { Box, Button, Flex, HStack, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Jdenticon from "react-jdenticon";
import { HiOutlineIdentification } from "react-icons/hi";
import { BiCake } from "react-icons/bi";

import { BOX_BORDER_COLOR, PRIMARY_COLOR } from "../../../../configs";
import OverviewDetailSpec from "../../../commons/OverviewDetailSpec";
import { formatDob } from "../../../../utils";

const CitizenListItem = ({ citizen }) => {
    const router = useRouter();
    const { id, idNumber, fullName, dob } = citizen;

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
            <Flex>
                <Jdenticon size="60" value={fullName} />
                <Box pt={1} ml={3}>
                    <Heading size="md">{fullName}</Heading>
                    <HStack mt={1} spacing={5}>
                        <OverviewDetailSpec
                            icon={HiOutlineIdentification}
                            value={idNumber}
                        />
                        <OverviewDetailSpec
                            icon={BiCake}
                            value={formatDob(dob)}
                        />
                    </HStack>
                </Box>
            </Flex>
            <Button
                colorScheme={PRIMARY_COLOR}
                onClick={(e) => {
                    router.push(`/citizens/overview/${id}`);
                }}
            >
                View Profile
            </Button>
        </Flex>
    );
};

export default CitizenListItem;
