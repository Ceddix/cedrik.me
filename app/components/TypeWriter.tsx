"use client";

import React from 'react';
import Typed from 'typed.js';
import { useKeyPress } from "ahooks";

export default function TypeWriter(props: any) {

    const [introduction, setIntro] = React.useState<boolean>(true);

    useKeyPress("ENTER", () => setIntro(false));

    // Create reference to store the DOM element containing the animation
    const el = React.useRef(null);

    React.useEffect(() => {

        let typeSpeed = props.typeSpeed;
        let startDelay = props.startDelay;

        if (!introduction) {
            startDelay = 0;
            typeSpeed = 0;
        }

        const typed = new Typed(el.current, {
            strings: [props.text],
            typeSpeed: typeSpeed,
            startDelay: startDelay,
        });

        if (!introduction) {
            typed.strPos = props.text.length - 1
        }

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };

    }, [introduction]);

    return (
        <div className="App">
            <span ref={el} className={props.className}></span>
        </div>
    );
}