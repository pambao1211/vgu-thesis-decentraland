import {
    Box,
    Flex,
    Spinner,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
} from "@chakra-ui/react";

const Loading = () => {
    return (
        <Modal isOpen={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex direction="column" align="center">
                        <Box mb={4}>Loading MetaMask Provider</Box>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            size="xl"
                            color="orange"
                        />
                    </Flex>
                </ModalHeader>
            </ModalContent>
        </Modal>
    );
};

export default Loading;
