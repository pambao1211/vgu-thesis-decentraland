import { useEffect } from "react";
import Link from "next/link";
import { Collapse, useDisclosure } from "@chakra-ui/react";

import NavItem from "./NavItem";

const GenericNavItem = ({ path, subItems, pl, ...rest }) => {
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
    if (path) {
        return (
            <Link w="100%" href={path} passHref>
                <a>
                    <NavItem pl={pl} path={path} {...rest} />
                </a>
            </Link>
        );
    } else {
        const renderedChildren = subItems.map((item) => {
            return <GenericNavItem pl={pl + 4} key={item.title} {...item} />;
        });
        return (
            <>
                <NavItem
                    onClick={subList.onToggle}
                    open={subList.isOpen}
                    pl={pl}
                    {...rest}
                />
                <Collapse w="100%" in={subList.isOpen}>
                    {renderedChildren}
                </Collapse>
            </>
        );
    }
};

export default GenericNavItem;
