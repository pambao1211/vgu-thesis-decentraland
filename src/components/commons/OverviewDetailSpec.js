import { Flex, Icon, Text } from "@chakra-ui/react";

import { DETAIL_INFO_COLOR } from "../../configs/index";

const OverviewDetailSpec = ({ isArea, icon, value }) => {
    return (
        <Flex align="center">
            <Icon mr={2} as={icon} />
            {isArea ? (
                <Text color={DETAIL_INFO_COLOR}>
                    {value}m<Text as="sup">2</Text>
                </Text>
            ) : (
                <Text color={DETAIL_INFO_COLOR}>{value}</Text>
            )}
        </Flex>
    );
};

export default OverviewDetailSpec;
