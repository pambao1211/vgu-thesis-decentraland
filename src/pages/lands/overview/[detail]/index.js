import { useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Heading,
    Icon,
    Stack,
    Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { GiFactory } from "react-icons/gi";
import _ from "lodash";

import OwnershipInfoList from "../../../../components/pages/lands/overview/OwnershipInfoList";
import Empty from "../../../../components/commons/Empty";
import { fetchLand } from "../../../../redux/actions";
import { formattedDate, formattedTime } from "../../../../utils";
import { PRIMARY_PATTERN_COLOR, DETAIL_INFO_COLOR } from "../../../../configs";

const renderedField = (label, content) => {
    return (
        <Flex align="center">
            <Text minW="30%" mr={3} size="md">
                {label}
            </Text>
            <Text color={DETAIL_INFO_COLOR}>{content}</Text>
        </Flex>
    );
};

const sectionTitle = (content) => {
    return (
        <Text
            color={PRIMARY_PATTERN_COLOR}
            textTransform="uppercase"
            fontWeight="bold"
            mb={5}
            size="md"
        >
            {content}
        </Text>
    );
};

const LandDetail = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const land = useSelector((state) => state.landReducer.selectedLand);
    const { detail: id } = router.query;

    useEffect(() => {
        console.log("useEffect");
        const intializeData = async () => {
            await dispatch(fetchLand(id));
        };
        intializeData();
    }, []);

    return (
        <Box w="100%">
            <Flex justify="center" align="flex-end" mb={5}>
                <Icon
                    mr={3}
                    color={PRIMARY_PATTERN_COLOR}
                    as={GiFactory}
                    boxSize={12}
                />
                <Heading size="lg">{land.landCode}</Heading>
            </Flex>
            {sectionTitle("Land Specifications")}
            <Stack pl={5} spacing={3}>
                {renderedField("Property Identification", land.id)}
                {renderedField("Township Code", land.landCode)}
                {renderedField(
                    "Township Name",
                    `Amsterdam ${land.parcelNumber}`
                )}
                {renderedField("Parcel Number", land.parcelNumber)}
                {renderedField(
                    "Area",
                    <>
                        {land.area} m<Text as="sup">2</Text>
                    </>
                )}
                {renderedField("Publish Admin", land.publishAdmin)}
                {renderedField("Publish Date", formattedDate(land.publishDate))}
                {renderedField("Publish Time", formattedTime(land.publishDate))}
            </Stack>
            <Divider my={8} borderColor={DETAIL_INFO_COLOR} />
            {sectionTitle("Ownership information")}

            {!_.isEmpty(land.transactions) ? (
                <OwnershipInfoList transactions={land.transactions} />
            ) : (
                <Flex w="100" direction="column" align="center">
                    <Empty
                        message="This land is currently vacant"
                        action={{
                            title: "Transfer",
                            action: () => {
                                console.log("Transfer");
                            },
                        }}
                    />
                </Flex>
            )}
        </Box>
    );
};

export default LandDetail;
