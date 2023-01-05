import React from "react";

interface TabProps {
    information: string;
    name: string;
}

interface TabsPropTypes {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    activeTab: string;
    tabs: TabProps[];
}
/**
 * Build a navigation tab takes activeTab and setActiveTab from useState
 * it also takes a tabs array of objects with information to display property and name to the tab
 */
function My_Tabs({ setActiveTab, activeTab, tabs }: TabsPropTypes) {
    const tabStyles = {
        active: "tw-underline tw-underline-offset-8 hover:tw-underline-offset-4",
        inactive: "tw-font-medium hover:tw-font-semibold hover:tw-underline hover:tw-underline-offset-8",
    };

    function toggleActiveTab(tabName: string) {
        if (activeTab === tabName) {
            return;
        }

        setActiveTab(tabName);
    }

    return (
        <div
            className="tw-flex tw-flex-row tw-justify-start tw-font-Quicksand tw-font-bold tw-text-lg tw-text-neutral-800 tw-p-2 lg:tw-p-4"
            id="tab"
        >
            {tabs.map((value) => {
                const { information, name } = value;
                return (
                    <span
                        key={name}
                        className={`tw-p-2 tw-cursor-pointer ${
                            activeTab.toLowerCase() === name ? tabStyles.active : tabStyles.inactive
                        } main-transition`}
                        onClick={() => {
                            toggleActiveTab(name);
                        }}
                        id="imageTab"
                    >
                        {information}
                    </span>
                );
            })}
        </div>
    );
}

export default My_Tabs;
