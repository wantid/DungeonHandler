import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Form, Row, Col, InputGroup, Accordion, Dropdown } from 'react-bootstrap';

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

export const PlayersList = forwardRef((props, ref) => {
    const [playersData, updateData] = useState([]);

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
    const handleChange = (playerId, keyName, keyValue) => {
        const updatedPlayer = playersData[playerId].map((item) => {
            if (item.name === keyName) item.value = keyValue;
            return item;
        });
        const nextPlayersData = playersData.map((item, i) => {
            if (i === playerId) item = updatedPlayer;
            return item;
        });

        updateData(nextPlayersData);
        handleUpdatePlayer(playerId, updatedPlayer);
    };

    /* Обновление данных о персонаже */
    const handleUpdatePlayer = async (playerId, playerData) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/players/id=${playerId}`, {
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
            <Accordion defaultActiveKey="0">
                {playersData.map((item, i) =>
                    <Accordion.Item eventKey={i} key={i}>
                        <Accordion.Header><strong>{item[0].value}</strong></Accordion.Header>
                        <Accordion.Body>
                            <Form key={i} >
                                <Row className="mb-3">
                                    {Array.isArray(item) ? item.map((player, playerKeyId) =>
                                        <Col xs={12} md={3} className="mb-3" key={playerKeyId}>
                                            <InputGroup key={playerKeyId} >
                                                <InputGroup.Text id="inputGroup-sizing-default"> {player.name} </InputGroup.Text>
                                                <Form.Control onChange={(e) => handleChange(i, e.target.name, e.target.value)}
                                                    size="sm" name={player.name} type={player.type} value={player.value} placeholder={player.name}
                                                />
                                            </InputGroup>
                                        </Col>
                                    ) : <p>Неправильно задан игрок id={i}</p>}
                                </Row>
                                <Button variant="danger" onClick={() => handleRemovePlayer(i)} size="lg">
                                    Удалить персонажа
                                </Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            <div className="d-grid gap-2 mt-3">
                <Button variant="primary" onClick={handleUpdate} size="lg">
                    Обновить
                </Button>
            </div>
        </>
    );
});

export const PlayerView = forwardRef((props, ref) => {
    const [playersData, updateData] = useState([]);

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

    return (
        <>
            <Accordion defaultActiveKey="0">
                {playersData.map((item, i) =>
                    <Accordion.Item eventKey={i} key={i}>
                        <Accordion.Header><strong>{item[0].value}</strong></Accordion.Header>
                        <Accordion.Body>
                            <Form key={i} >
                                <Row className="mb-3">
                                    {Array.isArray(item) ? item.map((player, playerKeyId) =>
                                        <Col xs={12} md={3} className="mb-3" key={playerKeyId}>
                                            <InputGroup key={playerKeyId} >
                                                <InputGroup.Text id="inputGroup-sizing-default"> {player.name} </InputGroup.Text>
                                                <Form.Control
                                                    size="sm" name={player.name} type={player.type} value={player.value} placeholder={player.name}
                                                    disabled readOnly
                                                />
                                            </InputGroup>
                                        </Col>
                                    ) : <p>Неправильно задан игрок id={i}</p>}
                                </Row>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            <TimedButton
                timedFunction={() => handleUpdate()} text={"Обновить"} delayTime={10}
            />
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
                {currentImage != "" ? <img className='turn__image' src={currentImage} alt="Current location" /> : <></>}
                <Row className="mb-3">
                    {playerData.map((item, i) =>
                        <Col xs={12} md={3} className="mb-3" key={i}>
                            <InputGroup>
                                <InputGroup.Text id="inputGroup-sizing-default"> {item.name} </InputGroup.Text>
                                <Form.Control
                                    size="sm" name={item.name} type={item.type} value={item.value} placeholder={item.name} disabled readOnly
                                />
                            </InputGroup>
                        </Col>
                    )}</Row>
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