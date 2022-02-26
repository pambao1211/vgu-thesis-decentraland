import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import FocusLock from "react-focus-lock";
import {
    Button,
    Box,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    Popover,
    PopoverHeader,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    FormControl,
    FormHelperText,
    FormLabel,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import _ from "lodash";

import Empty from "../../../commons/Empty";
import CitizenListItemContent from "../../../commons/CitizenListItemContent";
import { useAuth } from "../../../../contexts/AuthContext";
import { fetchLand } from "../../../../redux/actions";
import { getCitizenByIdNumber, transferLand } from "../../../../apis";
import {
    PRIMARY_BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_PATTERN_COLOR,
} from "../../../../configs";

const PopoverTransferBtn = ({ land, ...rest }) => {
    const { ml } = rest;
    const [citizenId, setCitizenId] = useState("");
    const [citizenResult, setCitizenResult] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [isTransfering, setIsTransfering] = useState(false);

    const inputRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const contract = useSelector((state) => state.contractReducer);
    const { currentUser } = useAuth();

    const cleanData = () => {
        setCitizenId("");
        setCitizenResult({});
        setIsSearching(false);
        setIsTransfering(false);
    };

    const handleClose = () => {
        cleanData();
        onClose();
    };

    const handleSubmit = async (value) => {
        setIsSearching(true);
        const citizen = await getCitizenByIdNumber(contract, value);
        setCitizenResult(citizen);
        console.log(citizen);
        setIsSearching(false);
    };

    const handleInputChange = async (e) => {
        const re = /^[0-9\b]+$/;
        let value = e.target.value;
        if (value.length > 10 || (value != "" && !re.test(value))) {
            return;
        }
        setCitizenId(value);
        setCitizenResult({});
        if (value.length == 10) {
            handleSubmit(value);
        }
    };

    const handleTransfer = async () => {
        setIsTransfering(true);
        try {
            const transferResult = await transferLand(
                contract,
                land.id,
                citizenResult.idNumber,
                currentUser
            );
            toast({
                title: "Land Ownership Transaction Success",
                description: "Land's ownership has been sucessfully transfered",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            await dispatch(fetchLand(land.id));
        } catch (e) {
            console.log(e);
            if (e.code && e.code === 4001) {
                toast({
                    title: "Transaction Denied",
                    description: "You have denied transaction signature",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else if (e.code && e.code === -32603) {
                toast({
                    title: "Transaction Denied",
                    description: "Citizen already owns this land.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setIsTransfering(false);
    };

    const isSubmitReady = () => {
        return !(_.isEmpty(citizenResult) || citizenResult.publishDate == 0);
    };

    const renderCitizenInfo = () => {
        if (!isSubmitReady()) {
            return (
                <Empty message="Please enter valid citizen id" boxSize={50} />
            );
        }
        return (
            <>
                <Box fontWeight="semibold" mb={1}>
                    Transfer this land to:
                </Box>
                <Box bgColor={PRIMARY_BACKGROUND_COLOR}>
                    <CitizenListItemContent citizen={citizenResult} />
                </Box>
            </>
        );
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={handleClose}
            closeOnBlur={false}
            initialFocusRef={inputRef}
            placement="top"
        >
            <PopoverTrigger>
                <Button ml={ml} colorScheme={PRIMARY_COLOR}>
                    Transfer
                </Button>
            </PopoverTrigger>
            <PopoverContent
                shadow="2xl"
                // borderColor={PRIMARY_PATTERN_COLOR}
                borderWidth={2}
                w="50vw"
                maxW="550px"
            >
                <PopoverArrow />
                <PopoverHeader>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        size="md"
                        color={PRIMARY_PATTERN_COLOR}
                    >
                        Transfer Ownership
                    </Text>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                    <FocusLock>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (isSubmitReady()) {
                                    await handleTransfer();
                                }
                            }}
                        >
                            <FormControl mb={3}>
                                <FormLabel>Enter Citizen Id:</FormLabel>
                                <InputGroup>
                                    <Input
                                        value={citizenId}
                                        onChange={handleInputChange}
                                        type="number"
                                        min="0"
                                        ref={inputRef}
                                        borderRadius="md"
                                    />
                                    <InputRightElement>
                                        {isSearching ? (
                                            <Spinner
                                                speed="0.65s"
                                                color={PRIMARY_COLOR}
                                            />
                                        ) : (
                                            <SearchIcon />
                                        )}
                                    </InputRightElement>
                                </InputGroup>
                                {citizenId.length < 10 && (
                                    <FormHelperText>
                                        Citizen id must contain 10 digit
                                    </FormHelperText>
                                )}
                            </FormControl>
                            {renderCitizenInfo()}
                        </form>
                    </FocusLock>
                </PopoverBody>
                <PopoverFooter
                    w="100%"
                    d="flex"
                    justifyContent="flex-end"
                    pb={4}
                    border={0}
                >
                    <Button variant="outline" mr={5} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        isLoading={isTransfering}
                        isDisabled={!isSubmitReady()}
                        colorScheme={PRIMARY_COLOR}
                        onClick={handleTransfer}
                    >
                        Transfer
                    </Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

export default PopoverTransferBtn;
