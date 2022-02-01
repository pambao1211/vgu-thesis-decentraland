import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const LandBreadcrumb = () => {
    const { pathname, basePath } = useRouter();
    const upper = (path) => {
        return path[0].toUpperCase() + path.substring(1);
    };

    const getItems = () => {
        const pathItems = pathname.split("/").slice(1, pathname.length);
        pathItems.unshift(basePath.replace("/", ""));
        return pathItems.map((item, index) => {
            let path;
            if (index === 0) {
                path = "/";
            } else {
                path = pathItems.slice(1, index + 1).join("/");
                path = "/" + path;
            }
            return (
                <BreadcrumbItem key={item}>
                    <Link href={path} passHref>
                        <Box _hover={{ color: "orange", cursor: "pointer" }}>
                            {upper(item)}
                        </Box>
                    </Link>
                </BreadcrumbItem>
            );
        });
    };
    {
        return pathname === "/_error" ? null : (
            <Breadcrumb
                spacing={2}
                separator={<ChevronRightIcon color="gray.500" />}
                mb={3}
            >
                {getItems()}
            </Breadcrumb>
        );
    }
};

export default LandBreadcrumb;
