import { Box, Icon, Tooltip } from "@chakra-ui/react";
import { BsShieldCheck } from "react-icons/bs";

import { PRIMARY_PATTERN_COLOR } from "../../configs";

const OwnedTooltipIcon = () => {
    return (
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
    );
};

export default OwnedTooltipIcon;
