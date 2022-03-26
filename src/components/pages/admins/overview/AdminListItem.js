import { Flex, Button, Box, Heading, HStack, Tooltip } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";
import { useRouter } from "next/router";
import { HiOutlineIdentification } from "react-icons/hi";
import { BiCodeAlt } from "react-icons/bi";

import OverviewDetailSpec from "../../../commons/OverviewDetailSpec";
import {
    BOX_BORDER_COLOR,
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
} from "../../../../configs";
import { formatAddress } from "../../../../utils";

const AdminListItem = ({ admin }) => {
    const router = useRouter();
    const { title, adminAddr, adminCode } = admin;
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
                <Jdenticon size="60" value={adminAddr} />
                <Box pt={1} ml={5}>
                    <Heading size="md">{title}</Heading>
                    <HStack mt={1} spacing={5}>
                        <OverviewDetailSpec
                            icon={BiCodeAlt}
                            value={adminCode}
                        />
                        <Tooltip
                            w="100vw"
                            label={adminAddr}
                            placement="top"
                            bg={PRIMARY_PATTERN_COLOR}
                        >
                            <div>
                                <OverviewDetailSpec
                                    icon={HiOutlineIdentification}
                                    value={formatAddress(adminAddr, 6)}
                                />
                            </div>
                        </Tooltip>
                    </HStack>
                </Box>
            </Flex>
            <Button
                colorScheme={PRIMARY_COLOR}
                onClick={(e) => {
                    router.push(`/admins/overview/${admin.id}`);
                }}
            >
                View Profile
            </Button>
        </Flex>
    );
};

export default AdminListItem;
