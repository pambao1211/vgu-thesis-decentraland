import { useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { GiFactory } from "react-icons/gi";
import _ from "lodash";

import OwnershipInfoList from "../../../../components/pages/lands/overview/OwnershipInfoList";
import PopoverTransferBtn from "../../../../components/pages/lands/overview/PopoverTransferBtn";
import Empty from "../../../../components/commons/Empty";
import { fetchLand } from "../../../../redux/actions";
import { formatDate, formatTime } from "../../../../utils";
import DetailBase from "../../../../components/commons/DetailBase";

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
        <OwnershipInfoList land={land} transactions={land.transactions} />
    ) : (
        <Flex w="100" direction="column" align="center">
            <Empty
                message="This land is currently vacant"
                component={<PopoverTransferBtn land={land} />}
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
        title2: "Ownership History",
        detailCards: detailCards,
    };

    return <DetailBase dataConfig={dataConfig} />;
};

export default LandDetail;
