import React from "react";
import InputField, { InputPropsTypes } from "@components/form/inputField";
import CheckBox, { CheckBoxPropTypes } from "@components/form/checkbox";
import Button, { ButtonPropTypes } from "@components/button";

export type FormPropTypes = {
    inputFields: InputPropsTypes[];
    buttons: ButtonPropTypes[];
    handleSubmit?: (evt: React.FormEvent<HTMLFormElement>) => void;
    checkboxes?: CheckBoxPropTypes[];
    alternativeOption?: React.ReactNode;
};

function Form({ inputFields, buttons, handleSubmit, checkboxes, alternativeOption }: FormPropTypes): JSX.Element {
    return (
        <form onSubmit={handleSubmit}>
            {/* map through input fields and display them */}
            {inputFields.map(
                ({
                    type,
                    label,
                    placeholder,
                    name,
                    value,
                    isAutoFocus,
                    isRequired,
                    helperMsg,
                    inputErrMsg,
                    handleBlur,
                    handleKeyup,
                    handleChange,
                }) => {
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
                            inputErrMsg={inputErrMsg}
                            handleBlur={handleBlur}
                            handleKeyup={handleKeyup}
                            handleChange={handleChange}
                        />
                    );
                }
            )}

            {typeof checkboxes !== "undefined" &&
                checkboxes.map(({ label, name, handleChange, value }) => {
                    return <CheckBox key={name} label={label} name={name} value={value} handleChange={handleChange} />;
                })}

            {typeof alternativeOption !== "undefined" && alternativeOption}

            {/* map through buttons and display them */}
            {buttons.map(({ typeOfButton, priority, value, isLoading, extraStyles: utilityClasses, handleClick }) => {
                return (
                    <Button
                        key={value}
                        priority={priority}
                        value={value}
                        typeOfButton={typeOfButton}
                        handleClick={handleClick}
                        isLoading={isLoading}
                        extraStyles={utilityClasses}
                    />
                );
            })}
        </form>
    );
}

export default Form;
