import React from "react";
import InputField, { InputPropsTypes } from "@components/inputField";
import CheckBox from "@components/checkbox";
import Button, { ButtonPropTypes } from "@components/button";

export type FormPropTypes = {
    inputFields: InputPropsTypes[];
    buttons: ButtonPropTypes[];
    handleSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
};

function Form({ inputFields, buttons, handleSubmit }: FormPropTypes): JSX.Element {
    /**
     * check if the every input in the form is of type password
     * @param arr []
     * @returns boolean
     */
    function isPasswordFields(arr: InputPropsTypes[]): boolean {
        return arr.every(({ type }) => {
            return type === "password";
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {inputFields.map(
                ({ type, label, placeholder, name, value, isAutoFocus, isRequired, helperMsg, validationChecks }) => {
                    return (
                        <InputField
                            key={name}
                            type={type}
                            label={label}
                            placeholder={placeholder}
                            name={name}
                            value={value}
                            isAutoFocus={isAutoFocus}
                            isRequired={isRequired}
                            helperMsg={helperMsg}
                            validationChecks={validationChecks}
                        />
                    );
                }
            )}
            {isPasswordFields(inputFields) && <CheckBox />}
            {buttons.map(({ typeOfButton, priority, value, handleClick }) => {
                return (
                    <Button
                        key={value}
                        priority={priority}
                        value={value}
                        typeOfButton={typeOfButton}
                        handleClick={handleClick}
                    />
                );
            })}
        </form>
    );
}

export default Form;
