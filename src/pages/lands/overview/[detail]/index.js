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
import { formatDate, formatTime } from "../../../../utils";
import { PRIMARY_PATTERN_COLOR, DETAIL_INFO_COLOR } from "../../../../configs";
import DetailBase from "../../../../components/commons/DetailBase";

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

    const detailCards = !_.isEmpty(land.transactions) ? (
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
    );

    const dataConfig = {
        headingIcon: GiFactory,
        heading: land.landCode,
        title1: "Land Specifications",
        detailedFields: [
            {
                title: "Property Identification",
                value: land.id,
            },
            {
                title: "Township Code",
                value: land.landCode,
            },
            {
                title: "Township Name",
                value: `Amsterdam ${land.parcelNumber}`,
            },
            {
                title: "Parcel Number",
                value: land.parcelNumber,
            },
            {
                title: "Area",
                value: (
                    <>
                        {land.area} m<Text as="sup">2</Text>
                    </>
                ),
            },
            {
                title: "Publish Admin",
                value: land.publishAdmin,
            },
            {
                title: "Publish Date",
                value: formatDate(land.publishDate),
            },
            {
                title: "Publish Time",
                value: formatTime(land.publishDate),
            },
        ],
        title2: "Ownership information",
        detailCards: detailCards,
    };

    return <DetailBase dataConfig={dataConfig} />;
};

export default LandDetail;
