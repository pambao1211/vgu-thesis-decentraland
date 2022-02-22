import { Box, Button, Flex, HStack, Icon, Heading } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { GiFactory } from "react-icons/gi";
import { BiArea } from "react-icons/bi";
import { GrDocumentUser } from "react-icons/gr";
import { useRouter } from "next/router";

import { selectLand } from "../../../../redux/actions";
import OverviewDetailSpec from "../../../commons/OverviewDetailSpec";
import {
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
    DETAIL_INFO_COLOR,
    BOX_BORDER_COLOR,
} from "../../../../configs";

const styleConfigs = {
    selectedConfig: {
        iconColor: PRIMARY_PATTERN_COLOR,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    defaultConfig: {
        iconColor: DETAIL_INFO_COLOR,
        borderWidth: 1,
        borderColor: BOX_BORDER_COLOR,
    },
};

const LandListItem = ({ land }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const selectedLand = useSelector((state) => state.landReducer.selectedLand);
    const config =
        land.id === selectedLand.id
            ? styleConfigs.selectedConfig
            : styleConfigs.defaultConfig;
    const { iconColor, borderWidth, borderColor } = config;

    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={5}
            borderWidth={borderWidth}
            borderColor={borderColor}
            borderRadius="md"
            shadow="md"
            _hover={{
                cursor: "pointer",
            }}
            onClick={() => {
                dispatch(selectLand(land.id));
            }}
        >
            <HStack spacing={5}>
                <Icon as={GiFactory} boxSize={12} color={iconColor} />
                <Flex direction="column">
                    <Heading size="md">{land.landCode}</Heading>
                    <Box color={DETAIL_INFO_COLOR}>
                        {`Amsterdam${land.parcelNumber}`}
                    </Box>
                </Flex>
                <OverviewDetailSpec isArea icon={BiArea} value={land.area} />
                <OverviewDetailSpec icon={GrDocumentUser} value={"Vacant"} />
            </HStack>
            <Button
                colorScheme={PRIMARY_COLOR}
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/lands/overview/${land.id}`);
                }}
            >
                Detail
            </Button>
        </Flex>
    );
};

export default LandListItem;
