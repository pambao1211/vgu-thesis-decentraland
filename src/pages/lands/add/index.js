import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

import { useAuth } from "../../../contexts/AuthContext";
import { publishLand } from "../../../redux/actions";
import GenericForm from "../../../components/commons/GenericForm";

export default function AddLand() {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const toast = useToast();

    const handleSubmit = async (values) => {
        const { owner, description, file } = values;
        try {
            await dispatch(publishLand(owner, description, file, currentUser));
            toast({
                title: "Land Registration Success.",
                description: "Land A has been successfully registered",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (e) {
            if (e.code && e.code === 4001) {
                toast({
                    title: "Transaction Denied",
                    description: "You have denied transaction signature",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const handleFileChange = (e, form) => {
        const fileReader = new FileReader();
        if (e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "utf-8");
            fileReader.onloadend = () => {
                const result = JSON.parse(fileReader.result);
                form.setFieldValue("file", fileReader.result);
                form.setFieldValue("area", result.area);
            };
        }
    };

    const formProperties = {
        heading: "Land Registration Form",
        initialValues: {
            owner: "",
            description: "",
            file: null,
            area: "",
        },
        validate: (values) => {
            const error = {};
            if (!values.owner) {
                error.owner = "You must enter your email";
            }
            if (!values.description) {
                error.description = "You must enter your password";
            }
            if (!values.file) {
                error.file = "You must upload meta-data file";
            }
            return error;
        },
        handleSubmit: handleSubmit,
        fields: [
            {
                name: "owner",
                label: "Owner",
                isRequired: true,
            },
            {
                name: "description",
                label: "Description",
                isRequired: true,
            },
            {
                name: "file",
                label: "File",
                type: "file",
                isRequired: true,
                handleFileChange: handleFileChange,
            },
            {
                name: "area",
                label: "Area",
                type: "number",
                isDisabled: true,
                variant: "filled",
                isRequired: true,
            },
        ],
    };

    return <GenericForm {...formProperties} />;
}
