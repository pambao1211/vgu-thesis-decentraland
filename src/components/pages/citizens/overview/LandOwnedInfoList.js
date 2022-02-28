import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
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

import OwnedTooltipIcon from "../../../commons/OwnedTooltipIcon";
import { formatDate, formatTime } from "../../../../utils";
import { selectLand } from "../../../../redux/actions";
import {
    DETAIL_INFO_COLOR,
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
    BOX_BORDER_COLOR,
} from "../../../../configs";

const styleConfigs = {
    selectedConfig: {
        iconColor: PRIMARY_PATTERN_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    defaultConfig: {
        iconColor: DETAIL_INFO_COLOR,
        borderColor: BOX_BORDER_COLOR,
    },
};

const LandOwnedInfoList = ({ transactions }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const selectedLand = useSelector((state) => state.landReducer.selectedLand);

    const ownedLandCard = (transaction) => {
        const { id, landId, landCode, transferDate } = transaction;
        const config =
            landId === selectedLand.id
                ? styleConfigs.selectedConfig
                : styleConfigs.defaultConfig;
        return (
            <React.Fragment key={id}>
                <Flex
                    w="100%"
                    justify="space-between"
                    align="center"
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                        dispatch(selectLand(transaction.landId));
                    }}
                >
                    <HStack
                        w="80%"
                        color={DETAIL_INFO_COLOR}
                        spacing={4}
                        py={3}
                    >
                        <Icon
                            as={GiFactory}
                            boxSize={12}
                            color={config.iconColor}
                        />
                        <Box w="30%">
                            <Text
                                color="black"
                                _hover={{
                                    color: PRIMARY_COLOR,
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/lands/overview/${landId}`);
                                }}
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
                    <OwnedTooltipIcon color={config.iconColor} />
                </Flex>
                <Divider my={8} borderColor={config.borderColor} />
            </React.Fragment>
        );
    };

    const renderOwnedLandCards = (transactions) => {
        return transactions.map((transaction) => ownedLandCard(transaction));
    };

    return (
        <Stack maxH="300px" overflowY="auto" pl={5} spacing={3}>
            {renderOwnedLandCards(transactions)}
        </Stack>
    );
};

export default LandOwnedInfoList;
