import { Box, Flex, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

import AdminBar from "./AdminBar";
import NavBar from "./nav-bar/NavBar";
import WrappedMap from "../components/map/WrappedMap";
import LandBreadcrumb from "../components/commons/LandBreadcrumb";

const Layout = ({ children }) => {
    return (
        <Grid overflow="hidden" templateColumns="repeat(12, 1fr)" h="100vh">
            <GridItem h="100vh" colSpan={2}>
                <NavBar />
            </GridItem>
            <GridItem overflow="auto" colSpan={6}>
                <Flex w="100%" p={5} alignItems="center" direction="column">
                    <AdminBar />
                    <Box w="100%" mt={20}>
                        <LandBreadcrumb />
                        <Flex
                            direction="column"
                            w="100%"
                            p={10}
                            justifyContent="flex-start"
                            alignItems="center"
                            borderWidth={1}
                            th={1}
                            borderRadius="md"
                            shadow="md"
                        >
                            {children}
                        </Flex>
                    </Box>
                </Flex>
            </GridItem>
            <GridItem colSpan={4}>
                <WrappedMap />
            </GridItem>
        </Grid>
    );
};

export default Layout;
