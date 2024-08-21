import React, { useState, useEffect } from 'react';
import { Form, Row, Accordion } from 'react-bootstrap';

import TimedButton from './TimedButton';

export const StoryView = () => {
    const [storyData, updateData] = useState([]);

    /* Первичная подгрузка данных */
    useEffect(() => {
        handleUpdate();
    }, []);

    /* Подгрузка данных */
    const handleUpdate = () => {
        fetch(`http://${window.location.hostname}:3010/api/info/story`)
            .then((response) => response.json())
            .then((data) => {
                updateData(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    return (
        <>
            <Accordion defaultActiveKey="0">
                {storyData.map((item, i) =>
                    <Accordion.Item eventKey={i} key={i}>
                        <Accordion.Header><strong>{item.name}</strong></Accordion.Header>
                        <Accordion.Body>
                            <Form key={i} >
                                <Row className="mb-3">
                                    {item.content.map((htmlItem, k) => <div key={k} dangerouslySetInnerHTML={{ __html: htmlItem }} />)}
                                </Row>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            <TimedButton
                timedFunction={() => handleUpdate()} text={"Обновить"} delayTime={60}
            />
        </>
    );
};

export const RulesView = () => {
    const [rulesData, updateData] = useState([]);

    /* Первичная подгрузка данных */
    useEffect(() => {
        handleUpdate();
    }, []);

    /* Подгрузка данных */
    const handleUpdate = () => {
        fetch(`http://${window.location.hostname}:3010/api/info/rules`)
            .then((response) => response.json())
            .then((data) => {
                updateData(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    return (
        <>
            <Accordion defaultActiveKey="0">
                {rulesData.map((item, i) =>
                    <Accordion.Item eventKey={i} key={i}>
                        <Accordion.Header><strong>{item.name}</strong></Accordion.Header>
                        <Accordion.Body>
                            <Form key={i} >
                                <Row className="mb-3">
                                    {item.content.map((htmlItem, k) => <div key={k} dangerouslySetInnerHTML={{ __html: htmlItem }} />)}
                                </Row>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            <TimedButton
                timedFunction={() => handleUpdate()} text={"Обновить"} delayTime={60}
            />
        </>
    );
};