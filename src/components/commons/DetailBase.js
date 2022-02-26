import React from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Divider,
    Icon,
} from "@chakra-ui/react";
import Jdenticon from "react-jdenticon";

import { PRIMARY_PATTERN_COLOR, DETAIL_INFO_COLOR } from "../../configs";

const sectionTitle = (content) => {
    return (
        <Text
            color={PRIMARY_PATTERN_COLOR}
            textTransform="uppercase"
            fontWeight="bold"
            mb={5}
        >
            {content}
        </Text>
    );
};

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

const renderedFields = (fields) => {
    return fields.map((field) => (
        <React.Fragment key={field.title}>
            {renderedField(field.title, field.value)}
        </React.Fragment>
    ));
};

const renderedHeadingIcon = (value) => {
    return typeof value === "string" ? (
        <Box mr={3}>
            <Jdenticon size="40" value={value} />
        </Box>
    ) : (
        <Icon mr={3} color={PRIMARY_PATTERN_COLOR} as={value} boxSize={12} />
    );
};

const DetailBase = ({ dataConfig }) => {
    const {
        headingIcon,
        heading,
        title1,
        detailedFields,
        title2,
        detailCards,
    } = dataConfig;
    return (
        <Box w="100%">
            <Flex justify="center" align="flex-end" mb={5}>
                {renderedHeadingIcon(headingIcon)}
                <Heading size="lg">{heading}</Heading>
            </Flex>
            {sectionTitle(title1)}
            <Stack pl={5} spacing={3}>
                {renderedFields(detailedFields)}
            </Stack>
            <Divider my={8} borderColor={DETAIL_INFO_COLOR} />
            {sectionTitle(title2)}
            {detailCards}
        </Box>
    );
};

export default DetailBase;
