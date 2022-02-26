import { Flex, Box, Heading, HStack } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";
import { HiOutlineIdentification } from "react-icons/hi";
import { BiCake } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";

import OverviewDetailSpec from "../commons/OverviewDetailSpec";
import { formatDob } from "../../utils";

const CitizenListItemContent = ({ citizen }) => {
    const { fullName, idNumber, gender, dob } = citizen;
    return (
        <Flex>
            <Jdenticon size="60" value={fullName} />
            <Box pt={1} ml={5}>
                <Heading size="md">{fullName}</Heading>
                <HStack mt={1} spacing={5}>
                    <OverviewDetailSpec
                        icon={HiOutlineIdentification}
                        value={idNumber}
                    />
                    <OverviewDetailSpec
                        icon={FaRegUser}
                        value={gender == "0" ? "Male" : "Female"}
                    />
                    <OverviewDetailSpec icon={BiCake} value={formatDob(dob)} />
                </HStack>
            </Box>
        </Flex>
    );
};

export default CitizenListItemContent;
