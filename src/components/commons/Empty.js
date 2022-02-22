import { Box, Flex, Icon, Button } from "@chakra-ui/react";
import { AiOutlineInbox } from "react-icons/ai";

import {
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
    DETAIL_INFO_COLOR,
} from "../../configs";

const Empty = ({ message, action }) => {
    return (
        <Flex direction="column" align="center" w="100%">
            <Icon
                color={PRIMARY_PATTERN_COLOR}
                boxSize={100}
                as={AiOutlineInbox}
            />
            <Box color={DETAIL_INFO_COLOR}>{message}</Box>
            {action && (
                <Button
                    mt={5}
                    colorScheme={PRIMARY_COLOR}
                    onClick={action.action}
                >
                    {action.title}
                </Button>
            )}
        </Flex>
    );
};

export default Empty;
