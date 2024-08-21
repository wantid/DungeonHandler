import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const TimedButton = ({ timedFunction, text, delayTime }) => {
    const [timeLeft, setTimeLeft] = useState(delayTime);

    useEffect(() => {
        // exit early when we reach 0
        if (timeLeft < 0) {
            setTimeLeft(delayTime);
            timedFunction();
        }

        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
    }, [timeLeft]);

    function onPress() {
        setTimeLeft(delayTime);
        timedFunction();
    }

    return (
        <>
            <div className="d-grid gap-2 mt-3">
                <Button variant="primary" type="submit" size="lg" onClick={onPress}>
                    {`${text} (${timeLeft} сек.)`}
                </Button>
            </div>
        </>
    );
};

export default TimedButton;