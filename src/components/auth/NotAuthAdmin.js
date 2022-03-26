import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    Icon,
    Box,
    ModalBody,
    Text,
} from "@chakra-ui/react";
import { BsShieldLock } from "react-icons/bs";
import { PRIMARY_COLOR } from "../../configs";
import { DETAIL_INFO_COLOR } from "../../configs";

const NotAuthAdmin = () => {
    return (
        <Modal isOpen={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    Unauthorized account
                </ModalHeader>
                <ModalBody>
                    <Flex
                        w="100%"
                        p={[0, 5]}
                        direction="column"
                        marginBottom={10}
                        align="center"
                        justify="center"
                    >
                        <Icon
                            as={BsShieldLock}
                            boxSize={50}
                            color={PRIMARY_COLOR}
                        />
                        <Text mt={3} w="70%" color={DETAIL_INFO_COLOR}>
                            Current account is not authorized please use
                            registered account!
                        </Text>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NotAuthAdmin;
