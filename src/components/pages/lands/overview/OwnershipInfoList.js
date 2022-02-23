import React from "react";
import {
    Box,
    Flex,
    Button,
    Divider,
    Tooltip,
    Text,
    HStack,
    Icon,
    Stack,
} from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";
import { BsShieldCheck } from "react-icons/bs";

import { formatDate, formatTime } from "../../../../utils";
import {
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
    DETAIL_INFO_COLOR,
} from "../../../../configs";

const ownershipCard = (transaction, isCurrentOwner) => {
    const { ownerIdNumber, ownerFullname, transferDate } = transaction;
    return (
        <React.Fragment key={transferDate}>
            <Flex w="100%" justify="space-between" align="center">
                <HStack w="80%" color={DETAIL_INFO_COLOR} spacing={4} py={3}>
                    <Jdenticon size="50" value={ownerFullname} />
                    <Box w="30%">
                        <Text>{ownerFullname}</Text>
                        <Text>{ownerIdNumber}</Text>
                    </Box>
                    <Box>
                        <Text>{formatDate(transferDate)}</Text>
                        <Text>{formatTime(transferDate)}</Text>
                    </Box>
                </HStack>
                {isCurrentOwner ? (
                    <Flex align="center">
                        <Tooltip
                            label="This user is currently the land's owner"
                            placement="top"
                            bg={PRIMARY_PATTERN_COLOR}
                        >
                            <Box>
                                <Icon
                                    color={PRIMARY_PATTERN_COLOR}
                                    boxSize={30}
                                    as={BsShieldCheck}
                                />
                            </Box>
                        </Tooltip>
                        <Button colorScheme={PRIMARY_COLOR} ml={4}>
                            Transfer
                        </Button>
                    </Flex>
                ) : null}
            </Flex>
            <Divider my={8} borderColor={DETAIL_INFO_COLOR} />
        </React.Fragment>
    );
};

const renderOwnerCard = (transactions) => {
    return transactions.map((transaction, index) =>
        ownershipCard(transaction, index === 0)
    );
};

const OwnershipInfoList = ({ transactions }) => {
    return (
        <Stack pl={5} spacing={3}>
            {renderOwnerCard(transactions)}
        </Stack>
    );
};

export default OwnershipInfoList;
