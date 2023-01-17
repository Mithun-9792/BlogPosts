import React from "react";
import Typewriter from "typewriter-effect";

function TypeWriter({ text, delay, deleteSpeed }) {
    return (
        <Typewriter
            options={{
                strings: [
                    text
                ],
                autoStart: true,
                loop: true,
                delay: delay,
                pauseFor: 10000,
                deleteSpeed: deleteSpeed

            }}
        />

    );
}

export default TypeWriter;