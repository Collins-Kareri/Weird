import React from "react";
import InputField, { InputPropsTypes } from "@components/inputField";
import CheckBox, { CheckBoxPropTypes } from "@components/checkbox";
import Button, { ButtonPropTypes } from "@components/button";

export type FormPropTypes = {
    inputFields: InputPropsTypes[];
    buttons: ButtonPropTypes[];
    handleSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
    checkboxes?: CheckBoxPropTypes[];
};

function Form({ inputFields, buttons, handleSubmit, checkboxes }: FormPropTypes): JSX.Element {
    return (
        <form onSubmit={handleSubmit}>
            {/* map through input fields and display them */}
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

            {typeof checkboxes !== "undefined" &&
                checkboxes.map(({ label, name, handleChange, value }) => {
                    return <CheckBox key={name} label={label} name={name} value={value} handleChange={handleChange} />;
                })}

            {/* map through buttons and display them */}
            {buttons.map(({ typeOfButton, priority, value, isLoading, handleClick }) => {
                return (
                    <Button
                        key={value}
                        priority={priority}
                        value={value}
                        typeOfButton={typeOfButton}
                        handleClick={handleClick}
                        isLoading={isLoading}
                    />
                );
            })}
        </form>
    );
}

export default Form;
