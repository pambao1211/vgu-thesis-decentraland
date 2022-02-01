import { FaLandmark, FaRegBuilding } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { BsPeople } from "react-icons/bs";
import {
    AiOutlineUserAdd,
    AiOutlineUsergroupAdd,
    AiOutlineFolderView,
    AiOutlineFolderAdd,
} from "react-icons/ai";
import { RiExchangeBoxLine } from "react-icons/ri";

const navBarItems = [
    {
        title: "Administrator",
        icon: FaLandmark,
        subItems: [
            {
                title: "Lands",
                icon: FaRegBuilding,
                subItems: [
                    {
                        title: "Overview",
                        icon: AiOutlineFolderView,
                        path: "/lands/overview",
                    },
                    {
                        title: "Add Land",
                        icon: AiOutlineFolderAdd,
                        path: "/lands/add",
                    },
                ],
            },
            {
                title: "Citizens Management",
                icon: BsPeople,
                subItems: [
                    {
                        title: "Overview",
                        icon: AiOutlineFolderView,
                        path: "/citizens/overview",
                    },
                    {
                        title: "Add Citizen",
                        icon: AiOutlineUsergroupAdd,
                        path: "/citizens/add",
                    },
                ],
            },
            {
                title: "Admin Management",
                icon: GrUserAdmin,
                subItems: [
                    {
                        title: "Overview",
                        icon: AiOutlineFolderView,
                        path: "/admins/overview",
                    },
                    {
                        title: "Add Admin",
                        icon: AiOutlineUserAdd,
                        path: "/admins/add",
                    },
                ],
            },
        ],
    },
    {
        title: "Marketplace",
        icon: RiExchangeBoxLine,
        path: "/marketplace",
    },
];

export { navBarItems };
