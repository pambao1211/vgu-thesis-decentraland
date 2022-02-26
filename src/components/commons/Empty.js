import { Box, Flex, Icon, Button } from "@chakra-ui/react";
import { AiOutlineInbox } from "react-icons/ai";

import {
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
    DETAIL_INFO_COLOR,
} from "../../configs";

const Empty = ({ message, component, boxSize = 100, ...rest }) => {
    return (
        <Flex direction="column" align="center" w="100%" {...rest}>
            <Icon
                color={PRIMARY_PATTERN_COLOR}
                boxSize={boxSize}
                as={AiOutlineInbox}
            />
            <Box mb={3} color={DETAIL_INFO_COLOR}>
                {message}
            </Box>
            {component && component}
        </Flex>
    );
};

export default Empty;
