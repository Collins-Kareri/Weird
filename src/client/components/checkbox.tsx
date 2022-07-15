import React from "react";

function CheckBox() {
    function togglePassword(allFormEl: HTMLFormControlsCollection, checked: boolean): void {
        for (let index = 0; index < allFormEl?.length; index++) {
            const currentEl = allFormEl[index] as HTMLInputElement | HTMLButtonElement;

            if (currentEl.type === "password" && currentEl.name.includes("password") && checked) {
                currentEl.type = "text";
            }

            if (currentEl.type === "text" && currentEl.name.includes("password") && !checked) {
                currentEl.type = "password";
            }
        }
        return;
    }

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        const el = evt.target;

        const parentForm = el.form as HTMLFormElement;

        const allFormEl = parentForm.elements;

        togglePassword(allFormEl, el.checked);

        return;
    }

    return (
        <div className="tw-px-4 tw-pb-4">
            <input
                onChange={handleChange}
                className="tw-mr-2"
                type="checkbox"
                value="show password"
                name="show_password"
            />
            <label className="tw-font-Quicksand tw-font-medium" htmlFor="show_password">
                show password
            </label>
        </div>
    );
}

export default CheckBox;
