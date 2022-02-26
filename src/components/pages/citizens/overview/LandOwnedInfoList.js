import React from "react";
import { useRouter } from "next/router";
import {
    Stack,
    Box,
    HStack,
    Flex,
    Icon,
    Divider,
    Text,
} from "@chakra-ui/react";
import { GiFactory } from "react-icons/gi";

import { formatDate, formatTime } from "../../../../utils";
import { DETAIL_INFO_COLOR, PRIMARY_COLOR } from "../../../../configs";
import OwnedTooltipIcon from "../../../commons/OwnedTooltipIcon";

const LandOwnedInfoList = ({ transactions }) => {
    const router = useRouter();

    const ownedLandCard = (transaction) => {
        const { id, landId, landCode, transferDate } = transaction;
        return (
            <React.Fragment key={id}>
                <Flex w="100%" justify="space-between" align="center">
                    <HStack
                        w="80%"
                        color={DETAIL_INFO_COLOR}
                        spacing={4}
                        py={3}
                    >
                        <Icon
                            as={GiFactory}
                            boxSize={12}
                            color={DETAIL_INFO_COLOR}
                        />
                        <Box w="30%">
                            <Text
                                color="black"
                                _hover={{
                                    color: PRIMARY_COLOR,
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    router.push(`/lands/overview/${landId}`)
                                }
                            >
                                {landCode}
                            </Text>
                            <Text>{`Amsterdam5002`}</Text>
                        </Box>
                        <Box>
                            <Text>{formatDate(transferDate)}</Text>
                            <Text>{formatTime(transferDate)}</Text>
                        </Box>
                    </HStack>
                    <OwnedTooltipIcon />
                </Flex>
                <Divider my={8} borderColor={DETAIL_INFO_COLOR} />
            </React.Fragment>
        );
    };

    const renderOwnedLandCards = (transactions) => {
        return transactions.map((transaction) => ownedLandCard(transaction));
    };

    return (
        <Stack pl={5} spacing={3}>
            {renderOwnedLandCards(transactions)}
        </Stack>
    );
};

export default LandOwnedInfoList;
