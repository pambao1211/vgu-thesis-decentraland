import {
    Button,
    Flex,
    Divider,
    Heading,
    Text,
    Stack,
    Box,
    useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Jdenticon from "react-jdenticon";

import { useAuth } from "../../contexts/AuthContext";
import { DETAIL_INFO_COLOR, navBarItems, PRIMARY_COLOR } from "../../configs";
import GenericNavItem from "./GenericNavItem";

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { currentUser } = useAuth();
    const renderedNavItems = navBarItems.map((item) => {
        const basePl = 4;
        return <GenericNavItem pl={basePl} key={item.title} {...item} />;
    });
    return (
        <Flex
            h="100%"
            w="100%"
            direction="column"
            justifyContent="space-between"
            py={5}
            overflowX="hidden"
            overflowY="auto"
            borderRightWidth="1px"
            shadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        >
            <Flex direction="column">
                <Text
                    bgGradient={`linear(to-r, ${PRIMARY_COLOR}.500 , ${PRIMARY_COLOR}.300)`}
                    bgClip="text"
                    fontSize="3xl"
                    fontWeight="bold"
                    textAlign="center"
                    letterSpacing="tight"
                >
                    Decentraland
                </Text>
                <Box my={5}>{renderedNavItems}</Box>
            </Flex>
            <Stack px={3} spacing={3}>
                <Divider />
                <Flex mt={4} pl={3} align="center" justify="space-between">
                    <Flex align="center">
                        <Jdenticon size="30" value={currentUser} />
                        <Flex ml={4} direction="column">
                            <Heading size="sm">Pambao</Heading>
                            <Text color={DETAIL_INFO_COLOR}>Admin</Text>
                        </Flex>
                    </Flex>
                    <Button
                        colorScheme={PRIMARY_COLOR}
                        onClick={toggleColorMode}
                    >
                        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </Flex>
            </Stack>
        </Flex>
    );
};

export default NavBar;
