import { useState } from "react";
import {
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Stack,
    Grid,
    GridItem,
    useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";

const GenericForm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { heading, initialValues, validate, handleSubmit, fields } = props;
    const toast = useToast();

    const renderedField = ({ field, form, label, ...props }) => {
        const { name } = field;
        const { isRequired } = props;
        const error = form.errors[name] && form.touched[name];
        const handleFileChange = (e, form) => {
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "utf-8");
            fileReader.onloadend = () => {
                form.values.file = fileReader.result;
            };
        };
        return (
            <FormControl isRequired w="100%" isInvalid={error}>
                <Grid templateColumns="repeat(10, 1fr)" gap={3}>
                    <GridItem display="flex" alignItems="center" colSpan={1}>
                        <FormLabel w="100px" textAlign="end">
                            {label}
                        </FormLabel>
                    </GridItem>
                    <GridItem colSpan={7}>
                        {props.type === "file" ? (
                            <Input
                                onChange={(e) => {
                                    handleFileChange(e, form);
                                }}
                                name={name}
                                {...props}
                            />
                        ) : (
                            <Input {...field} {...props} />
                        )}
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormErrorMessage mt={0}>
                            {form.errors[name]}
                        </FormErrorMessage>
                    </GridItem>
                </Grid>
            </FormControl>
        );
    };

    const renderedFormikFields = fields.map((field) => {
        return <Field key={field.name} {...field} component={renderedField} />;
    });

    const formHandleSubmit = async (values) => {
        setIsLoading(true);
        await handleSubmit(values);
        setIsLoading(false);
    };

    return (
        <>
            <Heading mb={10} size="md">
                {heading}
            </Heading>

            <Formik
                validate={validate}
                onSubmit={formHandleSubmit}
                initialValues={initialValues}
            >
                <Form>
                    <Stack alignItems="center" spacing={5}>
                        {renderedFormikFields}
                        <Button
                            isLoading={isLoading}
                            colorScheme="orange"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Stack>
                </Form>
            </Formik>
        </>
    );
};

export default GenericForm;
