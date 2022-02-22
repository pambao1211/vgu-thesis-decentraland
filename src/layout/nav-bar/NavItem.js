import { useRouter } from "next/router";
import { Flex, Icon, Text, Box } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

import { NAVBAR_PATTERN_COLOR } from "../../configs";

const NavItem = (props) => {
    const { pathname } = useRouter();
    const { title, icon, open, pl, path, ...rest } = props;
    return (
        <Box
            w="100%"
            pr={4}
            py={4}
            role="group"
            _hover={{ bg: NAVBAR_PATTERN_COLOR, cursor: "pointer" }}
            bgColor={pathname.includes(path) ? NAVBAR_PATTERN_COLOR : ""}
            transition=".15s ease"
            pl={pl}
            {...rest}
        >
            <Flex w="100%" alignItems="center">
                <Icon as={icon} boxSize="4" />
                <Text ml={2} fontWeight="semibold">
                    {title}
                </Text>
                {open != null && (
                    <Icon
                        transform={open && "rotate(90deg)"}
                        ml="auto"
                        as={ChevronRightIcon}
                    />
                )}
            </Flex>
        </Box>
    );
};

export default NavItem;
