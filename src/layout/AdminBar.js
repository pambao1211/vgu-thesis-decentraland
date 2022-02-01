import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";

import { useAuth } from "../contexts/AuthContext";

const AdminBar = () => {
    const { currentUser } = useAuth();
    return (
        <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            p={4}
            bg="white"
            borderRadius="xl"
            borderWidth={1}
            shadow="md"
        >
            <Text fontWeight="medium">Welcome, Ministry of Land</Text>
            <Flex justifyContent="space-between" alignItems="center">
                <Box color="gray">{currentUser}</Box>
                <Jdenticon size="30" value={currentUser} />
            </Flex>
        </Flex>
    );
};

export default AdminBar;
