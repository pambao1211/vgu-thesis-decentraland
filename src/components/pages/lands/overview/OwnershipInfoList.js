import React from "react";
import { useRouter } from "next/router";
import { Box, Flex, Divider, Text, HStack, Stack } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";

import OwnedTooltipIcon from "../../../commons/OwnedTooltipIcon";
import PopoverTransferBtn from "./PopoverTransferBtn";
import { formatDate, formatTime } from "../../../../utils";
import { PRIMARY_COLOR, DETAIL_INFO_COLOR } from "../../../../configs";

const OwnershipInfoList = ({ land, transactions }) => {
    const router = useRouter();
    const ownershipCard = (transaction, isCurrentOwner) => {
        const { id, ownerId, ownerIdNumber, ownerFullname, transferDate } =
            transaction;
        return (
            <React.Fragment key={id}>
                <Flex w="100%" justify="space-between" align="center">
                    <HStack
                        w="80%"
                        color={DETAIL_INFO_COLOR}
                        spacing={4}
                        py={3}
                    >
                        <Jdenticon size="50" value={ownerFullname} />
                        <Box w="30%">
                            <Text
                                color="black"
                                _hover={{
                                    color: PRIMARY_COLOR,
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    router.push(`/citizens/overview/${ownerId}`)
                                }
                            >
                                {ownerFullname}
                            </Text>
                            <Text>{ownerIdNumber}</Text>
                        </Box>
                        <Box>
                            <Text>{formatDate(transferDate)}</Text>
                            <Text>{formatTime(transferDate)}</Text>
                        </Box>
                    </HStack>
                    {isCurrentOwner ? (
                        <Flex align="center">
                            <OwnedTooltipIcon />
                            <PopoverTransferBtn ml={4} land={land} />
                        </Flex>
                    ) : null}
                </Flex>
                <Divider my={8} borderColor={DETAIL_INFO_COLOR} />
            </React.Fragment>
        );
    };

    const renderOwnerCards = (trxs) => {
        return trxs.map((transaction, index) =>
            ownershipCard(transaction, index === 0)
        );
    };

    return (
        <Stack maxH="300px" overflowY="auto" pl={5} spacing={3}>
            {renderOwnerCards(transactions)}
        </Stack>
    );
};

export default OwnershipInfoList;
