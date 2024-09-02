import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form, Row, Col, InputGroup, Accordion } from 'react-bootstrap';

import TimedButton from './TimedButton';
import PlayerData from './PlayerData';

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
    const [selectedPlayer, selectPlayer] = useState(0);

    const playerDataRef = useRef();

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
                let insertData;
                if (props.playersFilter) {
                    /* Фильтрация игроков */
                    insertData = data.map((player, playerId) => {
                        /* Перебор ключей игроков */
                        for (var i = 0; i < player.length; i++) {
                            if (player[i]["name"] == props.playersFilter["key"]) {
                                return props.playersFilter["filter"](player[i]["value"]) ?
                                    <option key={playerId} value={playerId}>{`[${playerId}] ${player[0]["value"]}`}</option> : <></>;
                            }
                        }
                        return <></>;
                    });
                } else {
                    insertData = data.map((player, playerId) =>
                        <option key={playerId} value={playerId}>{`[${playerId}] ${player[0]["value"]}`}</option>
                    );
                }
                updateData(insertData);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
        playerDataRef.current.handleUpdate();
    };

    return (
        <>
            <div className='container'>
                <Form.Select onChange={e => {
                    selectPlayer(e.target.value);
                }}>
                    {playersData}
                </Form.Select>
            </div>
            <PlayerData ref={playerDataRef} isMaster={props.ismaster} playerId={selectedPlayer} />
            <div className="d-grid gap-2 mt-3">
                <TimedButton
                    timedFunction={() => handleUpdate()} text={"Обновить"} delayTime={3}
                />
            </div>
        </>
    );
});

export const PlayersTurn = forwardRef((props, ref) => {
    const [playerId, updateTurn] = useState(0);
    const [currentImage, updateImage] = useState("");

    const playerDataRef = useRef();

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
        playerDataRef.current.handleUpdate();
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

    return (
        <>
            {currentImage != "" ?
                <>
                    <div className='header'>Текущая локация:</div>
                    <img className='turn__image' src={currentImage} alt="Current location" />
                </>
                :
                <></>}
            <PlayerData ref={playerDataRef} canRemove={false} playerId={playerId} />
            <TimedButton
                timedFunction={() => { handleUpdate(); handleUpdateImage(); }} text={"Обновить"} delayTime={3}
            />
        </>
    );
});