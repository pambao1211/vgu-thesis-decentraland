import { Flex, Divider, Text, Stack, Box, Icon } from "@chakra-ui/react";
import { BiCopyright } from "react-icons/bi";
import Jdenticon from "react-jdenticon";

import { DETAIL_INFO_COLOR, navBarItems, PRIMARY_COLOR } from "../../configs";
import GenericNavItem from "./GenericNavItem";

const AUTHOR_NAME = "Pham Gia Bao";
const SHORT_NAME = "Pambao";

const NavBar = () => {
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
            borderRightWidth="1px"
            shadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        >
            <Flex direction="column" overflowY="auto">
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
                        <Jdenticon size="30" value={AUTHOR_NAME} />
                        <Flex ml={4} direction="column">
                            {/* <Heading size="sm">Pham Gia Bao</Heading> */}
                            <Text
                                as="i"
                                fontSize="sm"
                                color={DETAIL_INFO_COLOR}
                            >
                                {`Developed by ${AUTHOR_NAME}`}
                            </Text>
                            <Flex
                                fontSize="sm"
                                color={DETAIL_INFO_COLOR}
                                align="center"
                            >
                                <Icon as={BiCopyright} />
                                <Text ml="1px" as="i">
                                    {`Copyright 2022 ${SHORT_NAME}`}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Stack>
        </Flex>
    );
};

export default NavBar;
