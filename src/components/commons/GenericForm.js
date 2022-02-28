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
    Select,
    Flex,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";

import { PRIMARY_COLOR } from "../../configs";

const GenericForm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { heading, initialValues, validate, handleSubmit, fields } = props;

    const renderedField = ({ field, form, label, ...props }) => {
        const { name } = field;
        const { isRequired, handleFileChange, onChange, ...rest } = props;
        const error = form.errors[name] && form.touched[name];

        const renderedInput = (type) => {
            switch (type) {
                case "file":
                    return (
                        <Input
                            name={name}
                            onChange={(e) => onChange(e, form)}
                            {...rest}
                        />
                    );
                case "select":
                    return (
                        <Select {...field} {...rest}>
                            {rest.options.map((option) => (
                                <option key={option.label} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    );
                case "citizenIdNumber":
                    return (
                        <Flex>
                            <Input
                                name={name}
                                value={form.values[name]}
                                onBlur={field.onBlur}
                                onChange={(e) => onChange(e, form)}
                                {...rest}
                            />
                        </Flex>
                    );
                default:
                    return <Input {...field} {...rest} />;
            }
        };

        return (
            <FormControl isRequired={isRequired} w="100%" isInvalid={error}>
                <Grid templateColumns="repeat(10, 1fr)" gap={3}>
                    <GridItem display="flex" alignItems="center" colSpan={1}>
                        <FormLabel w="100px" textAlign="end">
                            {label}
                        </FormLabel>
                    </GridItem>
                    <GridItem colSpan={7}>{renderedInput(props.type)}</GridItem>
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
                            colorScheme={PRIMARY_COLOR}
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
