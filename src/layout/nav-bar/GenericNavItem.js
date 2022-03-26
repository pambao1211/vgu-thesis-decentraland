import { useEffect } from "react";
import { Box, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { Collapse, useDisclosure } from "@chakra-ui/react";

import NavItem from "./NavItem";
import { useAuth } from "../../contexts/AuthContext";
import { NAVBAR_PATTERN_COLOR, PRIMARY_PATTERN_COLOR } from "../../configs";

const GenericNavItem = ({
    path,
    subItems,
    pl,
    requiredOwner = false,
    ...rest
}) => {
    const { currentAdmin } = useAuth();
    const { title } = rest;
    const subList = useDisclosure();
    useEffect(() => {
        if (!path) {
            const isOpen = localStorage.getItem(title);
            if (isOpen == "true") {
                subList.onToggle();
            }
        }
    }, []);
    useEffect(() => {
        if (!path) {
            localStorage.setItem(title, subList.isOpen);
        }
    }, [subList.isOpen]);

    const renderCompositeNavItem = (isAuthorized = true) => {
        const renderedChildren = subItems.map((item) => {
            return <GenericNavItem pl={pl + 4} key={item.title} {...item} />;
        });
        return (
            <>
                <NavItem
                    onClick={() => {
                        if (isAuthorized) {
                            subList.onToggle();
                        }
                    }}
                    open={subList.isOpen}
                    pl={pl}
                    _hover={{
                        bg: NAVBAR_PATTERN_COLOR,
                        cursor: isAuthorized ? "pointer" : "not-allowed",
                    }}
                    {...rest}
                />
                <Collapse w="100%" in={subList.isOpen}>
                    {renderedChildren}
                </Collapse>
            </>
        );
    };

    if (requiredOwner) {
        if (currentAdmin && !currentAdmin.isContractOwner) {
            if (subList.isOpen) {
                subList.onToggle();
            }
            return (
                <Tooltip
                    label="Only contract owner is authorized"
                    placement="top"
                    bg={PRIMARY_PATTERN_COLOR}
                >
                    <Box>{renderCompositeNavItem(false)}</Box>
                </Tooltip>
            );
        }
    }

    if (path) {
        return (
            <Link w="100%" href={path} passHref>
                <a>
                    <NavItem pl={pl} path={path} {...rest} />
                </a>
            </Link>
        );
    } else {
        return renderCompositeNavItem();
    }
};

export default GenericNavItem;
