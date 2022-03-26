import { Box, Flex, Icon, Text, Badge } from "@chakra-ui/react";

import { DETAIL_INFO_COLOR } from "../../configs/index";

const OverviewDetailSpec = ({ type, icon, value }) => {
    const renderValue = () => {
        switch (type) {
            case "area":
                return (
                    <Text color={DETAIL_INFO_COLOR}>
                        {value}m<Text as="sup">2</Text>
                    </Text>
                );
            case "occupiedStatus":
                return (
                    <Badge colorScheme={value == "Occupied" ? "red" : "green"}>
                        {value}
                    </Badge>
                );
            default:
                return <Text color={DETAIL_INFO_COLOR}>{value}</Text>;
        }
    };
    return (
        <Flex align="center">
            <Icon mr={2} as={icon} />
            {renderValue()}
        </Flex>
    );
};

export default OverviewDetailSpec;
