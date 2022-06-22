import React, { useState } from "react";
import { Container } from "@chakra-ui/react";

function Val() {
    // eslint-disable-next-line no-unused-vars
    const [num, setNum] = useState(["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]);

    function detemineIndex(index) {
        if (index === 0 || index === 9) {
            return "400px";
        }

        if (index === 5) {
            return "600px";
        }

        if (index === 6 || index === 11) {
            return "450px";
        }

        return "300px";
    }

    return (
        <>
            {num.map((val, index) => {
                return (
                    <Container
                        display={"inline-block"}
                        background={"rebeccapurple"}
                        width="300px"
                        height={detemineIndex(index)}
                        key={index}
                    >
                        {val}
                    </Container>
                );
            })}
        </>
    );
}

export default Val;