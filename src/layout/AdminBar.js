import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";
import { DETAIL_INFO_COLOR } from "../configs";

import LoadingSkeleton from "../components/commons/LoadingSkeleton";
import { useAuth } from "../contexts/AuthContext";

const AdminBar = () => {
    const { currentUser, currentAdmin } = useAuth();
    const getGreetingText = () => {
        if (currentAdmin && currentAdmin.id != 0) {
            return `Welcome ${currentAdmin.title}`;
        }
        return "Not authorized account";
    };
    return (
        <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            p={4}
            borderRadius="xl"
            borderWidth={1}
            shadow="md"
        >
            {!currentAdmin ? (
                <LoadingSkeleton numberSkeleton={1} />
            ) : (
                <>
                    <Text textTransform="capitalize" fontWeight="medium">
                        {getGreetingText()}
                    </Text>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box pr={2} color={DETAIL_INFO_COLOR}>
                            {currentUser}
                        </Box>
                        <Jdenticon size="30" value={currentUser} />
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default AdminBar;
