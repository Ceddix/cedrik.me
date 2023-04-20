"use client";

import React from 'react';
import Typed from 'typed.js';

export default function TypeWriter(props: any) {
    // Create reference to store the DOM element containing the animation
    const el = React.useRef(null);

    React.useEffect(() => {

        const typed = new Typed(el.current, {

            strings: [props.text],
            typeSpeed: props.typeSpeed ?? 50,
            startDelay: props.startDelay ?? 0,

            onComplete: () => {
                console.log('completed')
            }

        });

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };

    }, []);

    return (
        <div className="App">
            <span ref={el} className={props.className}/>
        </div>
    );
}