import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

import TimedButton from './TimedButton';
import PlayerData from './PlayerData';

const MapData = () => {
    const [svgContent, setSvgContent] = useState('');
    const [content, setContent] = useState({});
    const [modalContent, setModalContent] = useState(<></>);
    const [modalShow, setModalShow] = React.useState(false);

    const svgContainerRef = useRef(null);
    const playerDataRef = useRef();

    useEffect(() => {
        if (svgContent && svgContainerRef.current) {
            const svgElement = svgContainerRef.current.querySelector('svg');

            if (svgElement) {
                for (var key in content) {
                    let elementStruct = content[key];
                    const element = svgElement.getElementById(key);

                    if (element) {
                        // Удаление предыдущих слушателей
                        const newElement = element.cloneNode(true);
                        element.parentNode.replaceChild(newElement, element);

                        newElement.addEventListener('click', () => {
                            switch (elementStruct["type"]) {
                                case "text":
                                    setModalContent(
                                        <div dangerouslySetInnerHTML={{ __html: elementStruct["value"] }} />
                                    );
                                    setModalShow(true);
                                    break;
                                case "character":
                                    setModalContent(
                                        <>
                                            <PlayerData ref={playerDataRef} canRemove={false} playerId={elementStruct["value"]} />
                                            <TimedButton
                                                timedFunction={() => { if (playerDataRef.current) playerDataRef.current.handleUpdate() }} text={"Обновить"} delayTime={3}
                                            />
                                        </>
                                    );
                                    setModalShow(true);
                                    break;
                                case "map":
                                    setModalContent(
                                        <></>
                                    );
                                    setModalShow(false);
                                    handleChangeMap(elementStruct["value"]);
                                    break;
                            }
                        });
                        for (var attribute in elementStruct["attributes"]) {
                            newElement.setAttribute(attribute, elementStruct["attributes"][attribute]);
                        }
                    }
                }
            }
        }
    }, [svgContent, content]);

    useEffect(() => {
        handleUpdate();
    }, []);

    /* Подгрузка текущего хода */
    const handleUpdate = () => {
        // Загрузка SVG с сервера
        fetch(`http://${window.location.hostname}:3010/api/map/image/`)
            .then(response => response.text())
            .then(data => setSvgContent(data));
        // Загрузка контента с сервера
        fetch(`http://${window.location.hostname}:3010/api/map/current/`)
            .then(response => response.json())
            .then(data => setContent(data));
    };

    /* Изменить текущую карту */
    const handleChangeMap = async (In_MapId) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/map/set/${In_MapId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            console.log(result);
            handleUpdate();
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    {modalContent}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
            <div
                ref={svgContainerRef}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <TimedButton
                timedFunction={() => { handleUpdate() }} text={"Обновить"} delayTime={120}
            />
        </>
    );
};

export default MapData;