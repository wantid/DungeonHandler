import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Form, Row, Col, InputGroup, Accordion } from 'react-bootstrap';

import TimedButton from './TimedButton';

export const PlayerCreate = () => {
    const [formData, setFormData] = useState([]);
    const [templates, setTemplates] = useState([]);

    /* Подгрузка списка шаблонов */
    useEffect(() => {
        fetch(`http://${window.location.hostname}:3010/api/templates`)
            .then((response) => response.json())
            .then((data) => {
                setTemplates(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);

    /* Выбор шаблона */
    const chooseTemplate = (templateName) => {
        fetch(`http://${window.location.hostname}:3010/api/templates/${templateName}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setFormData([]);
            });
    };


    /* Обновление локальных данных */
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const nextFormData = formData.map((item) => {
            if (item.name === name) item.value = value;
            return item;
        });
        setFormData(nextFormData);
    };

    /* Отправка данных на сервер */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.length === 0) return;
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result); // Ответ от сервера
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <>
            <Form.Select onChange={e => {
                console.log("e.target.value", e.target.value);
                chooseTemplate(e.target.value);
            }}>
                <option key={"none"}>{"--- не выбран шаблон ---"}</option>
                {templates.map((item, i) =>
                    <option key={i} value={item}>{item}</option>
                )}
            </Form.Select>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3" style={{ backgroundColor: '#ffffff90', margin: '.5rem', padding: '1rem', borderRadius: '.5rem' }}>
                    {formData.map((item, i) =>
                        <Col xs={12} md={3} key={i} className="mb-3">
                            <Form.Group as={Col} key={i} >
                                <Form.Label>{item.name}</Form.Label>
                                <Form.Control size="sm" name={item.name} type={item.type} value={item.value} placeholder={item.name} onChange={handleChange} />
                                <Form.Text className="text-muted">
                                    {item.dsc}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    )}
                </Row>
                <div className="d-grid gap-2">
                    <Button variant="success" type="submit" size="lg">
                        Создать
                    </Button>
                </div>
            </Form>
        </>
    );
};

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
                return <Col xs={12} md={3} className="mb-3" key={in_key}>
                    <InputGroup key={in_key} >
                        <InputGroup.Text id="inputGroup-sizing-default"> {in_elementStruct.name} </InputGroup.Text>
                        <Form.Control onChange={(e) => { console.log(in_path); in_handleChange(in_path, e.target.value) }}
                            size="sm"
                            name={in_elementStruct.name}
                            type={in_elementStruct.type}
                            value={in_elementStruct.value}
                            placeholder={in_elementStruct.name}
                            disabled={in_disabled}
                        />
                    </InputGroup>
                </Col>;
        }
    } catch (e) {
        console.log('Не удалось создать элемент формы:');
        console.log(in_elementStruct);
        return <></>;
    }
}

export const PlayersList = forwardRef((props, ref) => {
    const [playersData, updateData] = useState([]);
    const [selectedPlayer, selectPlayer] = useState(0);

    /* Управление компонентом из родителя */
    useImperativeHandle(ref, () => ({
        updateList() {
            handleUpdate();
        }
    }));

    /* Первичная подгрузка игроков */
    useEffect(() => {
        handleUpdate();
    }, []);

    /* Подгрузка игроков */
    const handleUpdate = () => {
        fetch(`http://${window.location.hostname}:3010/api/players`)
            .then((response) => response.json())
            .then((data) => {
                updateData(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Обновление локальных данных */
    const handleChange = (keyPath, keyValue) => {
        try {
            if (!(keyPath instanceof Array)) return;
            let playerId = keyPath[0];
            keyPath.shift();
            let stringPath = '["' + keyPath.join('"]["') + '"]';
            let updatedPlayer = playersData[playerId];
            eval(`updatedPlayer${stringPath}["value"]="${keyValue}"`);

            const nextPlayersData = playersData.map((item, id) => {
                if (id === playerId) {
                    return updatedPlayer;
                }
                return item;
            });
            nextPlayersData[playerId] = updatedPlayer;

            updateData(nextPlayersData);
            handleUpdatePlayer(playerId, { path: stringPath, value: keyValue });
        } catch (e) {
            console.log(e);
            console.log(keyPath);
        }
    };

    /* Обновление параметров персонажа */
    const handleUpdatePlayer = async (playerId, playerData) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/setkey/id=${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            });
            const result = await response.json();
            console.log(result); // Ответ от сервера
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Удаление персонажа */
    const handleRemovePlayer = async (playerId) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/remove/id=${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            handleUpdate();
            console.log(result); // Ответ от сервера
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <>
            <div className='container'>
                <Form.Select onChange={e => {
                    selectPlayer(e.target.value);
                }}>
                    {playersData.map((item, i) =>
                        <option key={i} value={i}>{item[0].value}</option>
                    )}
                </Form.Select>
            </div>
            <Form key={selectedPlayer} className='container'>
                <Row className="mb-3">
                    {Array.isArray(playersData[selectedPlayer]) ? playersData[selectedPlayer].map((player, playerKeyId) =>
                        drawForm(player, playerKeyId, handleChange, false, [selectedPlayer, playerKeyId])
                    ) : <p>Неправильно задан игрок id={selectedPlayer}</p>}
                </Row>
                {props.ismaster ? <Button variant="danger" onClick={() => handleRemovePlayer(selectedPlayer)} size="lg">
                    Удалить персонажа
                </Button> : <></>}
            </Form>
            <div className="d-grid gap-2 mt-3">
                <TimedButton
                    timedFunction={() => handleUpdate()} text={"Обновить"} delayTime={3}
                />
            </div>
        </>
    );
});

export const PlayersTurn = forwardRef((props, ref) => {
    const [playerData, updateData] = useState([]);
    const [playerId, updateTurn] = useState(0);
    const [currentImage, updateImage] = useState("");

    /* Управление компонентом из родителя */
    useImperativeHandle(ref, () => ({
        updateList() {
            handleUpdate();
            handleUpdateImage();
        }
    }));

    /* Первичная подгрузка хода */
    useEffect(() => {
        handleUpdate();
        handleUpdateImage();
    }, []);

    /* Обновление текущего игрока */
    useEffect(() => {
        handleUpdatePlayer();
    }, [playerId]);
    async function handleUpdatePlayer() {
        let response;
        try {
            response = await fetch(`http://${window.location.hostname}:3010/api/players/id=${playerId}`);
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
    const handleChange = (keyPath, keyValue) => {
        try {
            if (!(keyPath instanceof Array)) return;
            keyPath.shift();
            let stringPath = '["' + keyPath.join('"]["') + '"]';
            let updatedPlayer = playerData.map((x) => x);;
            eval(`updatedPlayer${stringPath}["value"]="${keyValue}"`);

            updateData(updatedPlayer);
            handleUpdatePlayerField({ path: stringPath, value: keyValue });
        } catch (e) {
            console.log(e);
            console.log(keyPath);
        }
    };

    /* Обновление параметров персонажа */
    const handleUpdatePlayerField = async (in_playerData) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/setkey/id=${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(in_playerData),
            });
            const result = await response.json();
            console.log(result); // Ответ от сервера
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Подгрузка текущего хода */
    const handleUpdate = () => {
        fetch(`http://${window.location.hostname}:3010/api/turn/`)
            .then((response) => response.json())
            .then((data) => {
                updateTurn(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Подгрузка текущего изображения */
    async function handleUpdateImage() {
        let response;
        try {
            response = await fetch(`http://${window.location.hostname}:3010/api/images/current/`);
        } catch (error) {
            console.log('error')
            updateImage("");
        }

        if (response?.ok) {
            const data = await response.blob()
            let imageUrl = URL.createObjectURL(data);
            updateImage(imageUrl);
        } else {
            console.log(`error code: ${response?.status}`);
            updateImage("");
        }
    };

    /* Следущий ход */
    const handleTurn = () => {
        fetch(`http://${window.location.hostname}:3010/api/turn/next`)
            .then((response) => response.json())
            .then((data) => {
                updateTurn(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
        handleUpdate();
    };

    /* Новая битва */
    const handleSort = (keyName) => {
        fetch(`http://${window.location.hostname}:3010/api/turn/sort/${keyName}`)
            .then((response) => response.json())
            .then((data) => {
                updateTurn(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
        handleUpdate();
    };

    return (
        <>
            <Form>
                {currentImage != "" ?
                    <>
                        <div className='header'>Текущая локация:</div>
                        <img className='turn__image' src={currentImage} alt="Current location" />
                    </>
                    :
                    <></>}
                <Row className="mb-3">
                    {playerData.length > 0 ?
                        <>
                            <div className='header'>Текущий игрок:</div>
                            <Form key={playerId} className='container'>
                                <Row className="mb-3">
                                    {Array.isArray(playerData) ? playerData.map((player, playerKeyId) =>
                                        drawForm(player, playerKeyId, handleChange, false, [playerId, playerKeyId])
                                    ) : <p>Неправильно задан игрок id={playerId}</p>}
                                </Row>
                            </Form>
                        </>
                        : <></>}
                </Row>
            </Form>
            {/* <div className="d-grid gap-2 mt-3">
                <Button variant="success" onClick={() => handleTurn()} size="lg">
                    Следующий ход
                </Button>
            </div>
            <div className="d-grid gap-2 mt-3">
                <Button variant="warning" onClick={() => handleSort("Инициатива")} size="lg">
                    Начать новую битву
                </Button>
            </div> */}
            <TimedButton
                timedFunction={() => { handleUpdate(); handleUpdateImage(); }} text={"Обновить"} delayTime={3}
            />
        </>
    );
});