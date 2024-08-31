import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form, Row, Col, InputGroup, Accordion, FormGroup } from 'react-bootstrap';

const PlayerData = forwardRef((props, ref) => {
    const [playerData, updateData] = useState([]);
    const [pausedUpdate, setPauseUpdate] = useState(false);
    const [lasteKeyChange, setLasteKeyChange] = useState("");

    /* Управление компонентом из родителя */
    useImperativeHandle(ref, () => ({
        handleUpdate() {
            handleUpdatePlayer();
        }
    }));

    /* Обновление текущего игрока */
    useEffect(() => {
        handleUpdatePlayer();
    }, [props.playerId]);
    async function handleUpdatePlayer() {
        if (pausedUpdate) return;
        let response;
        try {
            response = await fetch(`http://${window.location.hostname}:3010/api/players/id=${props.playerId}`);
        } catch (error) {
            console.log('error')
            updateData([]);
        }

        if (response?.ok) {
            const data = await response.json();
            updateData(data);
        } else {
            console.log(`error code: ${response?.status}`);
            updateData([]);
        }
    };

    /* Обновление локальных данных */
    const sendDataTimeout = useRef();
    const handleChange = (keyPath, keyValue) => {
        try {
            if (!(keyPath instanceof Array)) return;
            keyPath.shift();
            let stringPath = '["' + keyPath.join('"]["') + '"]';
            let updatedPlayer = playerData.map((x) => x);;
            eval(`updatedPlayer${stringPath}["value"]="${keyValue}"`);

            updateData(updatedPlayer);
            setPauseUpdate(true);
            let nowKey = JSON.parse(keyPath.pop());
            if (lasteKeyChange == nowKey) clearTimeout(sendDataTimeout.current);
            setLasteKeyChange(nowKey);
            sendDataTimeout.current = setTimeout(() => {
                handleUpdatePlayerField({ path: stringPath, value: keyValue });
                setPauseUpdate(false);
            }, 1000);
        } catch (e) {
            console.log(e);
        }
    };

    /* Обновление параметров персонажа */
    const handleUpdatePlayerField = async (in_playerData) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/setkey/id=${props.playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(in_playerData),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Удаление персонажа */
    const handleRemovePlayer = async () => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/remove/id=${props.playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            updateData([]);
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <Form className='container'>
            <Row className="mb-3">
                {Array.isArray(playerData) ? playerData.map((playerKey, playerKeyId) =>
                    drawForm(playerKey, playerKeyId, handleChange, false, [props.playerId, playerKeyId])
                ) : <p>Неправильно задан игрок id={props.playerId}</p>}
            </Row>
            {props.canRemove ? <Button variant="danger" onClick={handleRemovePlayer} size="lg">
                Удалить персонажа
            </Button> : <></>}
        </Form>
    );
});

function drawForm(in_elementStruct, in_key, in_handleChange, in_disabled, in_path) {
    try {
        switch (in_elementStruct.type) {
            case "container":
                in_path.push("value");
                return <Col lg={12} className="mb-3" key={in_key}>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey={in_key} key={in_key}>
                            <Accordion.Header><strong>{in_elementStruct.name}</strong></Accordion.Header>
                            <Accordion.Body>
                                <Row className="mb-3">
                                    {Array.isArray(in_elementStruct.value) ? in_elementStruct.value.map((child, childId) =>
                                        drawForm(
                                            child, childId,
                                            in_handleChange, in_disabled,
                                            in_path.concat([childId])
                                        )
                                    ) : <p>Неправильно задан игрок id={in_key}</p>}
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>;
            default:
                return <Form.Group xs={in_elementStruct.long ? 12 : 6} md={in_elementStruct.long ? 6 : 2} className="mb-3" key={in_key} as={Col}>
                    <InputGroup key={in_key} >
                        <InputGroup.Text id="inputGroup-sizing-default"> {in_elementStruct.name} </InputGroup.Text>
                        <Form.Control onChange={(e) => { console.log(in_path); in_handleChange(in_path, e.target.value) }}
                            size="sm"
                            name={in_elementStruct.name}
                            type={in_elementStruct.type}
                            value={in_elementStruct.value}
                            placeholder={in_elementStruct.name}
                            disabled={in_disabled}
                            as={in_elementStruct.long ? "textarea" : "input"}
                        />
                    </InputGroup>
                    <Form.Text className="text-muted">
                        {in_elementStruct.dsc}
                    </Form.Text>
                </Form.Group>;
        }
    } catch (e) {
        console.log('Не удалось создать элемент формы:');
        console.log(in_elementStruct);
        return <></>;
    }
}

export default PlayerData;