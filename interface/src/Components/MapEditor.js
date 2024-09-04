import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form, Row, Col, InputGroup, Accordion } from 'react-bootstrap';

import TimedButton from './TimedButton';
import PlayerData from './PlayerData';

const MapEditor = () => {
    const [mapList, setMapList] = useState([]);
    const [mapData, setMapData] = useState({});
    const [mapId, setMapId] = useState(-1);
    const [formData, setFormData] = useState([]);

    const [mapProperties, setMapProperties] = useState({});
    const [formProperties, setFormProperties] = useState([]);

    const [creationData, setCreationData] = useState({});
    const [formCreation] = useState(
        <>
            <InputGroup>
                <InputGroup.Text id="inputGroup-sizing-default">{"name"}</InputGroup.Text>
                <Form.Control
                    name={"name"} type="text" value={creationData["name"]}
                    placeholder="-" onChange={(e) => {
                        setCreationData(creationData => ({
                            ...creationData, [e.target.name]: e.target.value
                        }))
                    }}
                />
            </InputGroup>
            <InputGroup>
                <InputGroup.Text id="inputGroup-sizing-default">{"src"}</InputGroup.Text>
                <Form.Control
                    name={"src"} type="text" value={creationData["src"]}
                    placeholder="-" onChange={(e) => {
                        setCreationData(creationData => ({
                            ...creationData, [e.target.name]: e.target.value
                        }))
                    }}
                />
            </InputGroup>
            <InputGroup>
                <InputGroup.Text id="inputGroup-sizing-default">{"image"}</InputGroup.Text>
                <Form.Control
                    name={"image"} type="text" value={creationData["image"]}
                    placeholder="-" onChange={(e) => {
                        setCreationData(creationData => ({
                            ...creationData, [e.target.name]: e.target.value
                        }))
                    }}
                />
            </InputGroup>
        </>
    );

    const [svgContent, setSvgContent] = useState('');

    /* Отрисовка формы свойств карты */
    useEffect(() => {
        let _array = [];
        let _counter = 0;
        for (var key in mapProperties) {
            /* Отрисовка элемента */
            _array.push(
                <Col lg={12} className="mb-3" key={_counter}>
                    <InputGroup>
                        <InputGroup.Text id="inputGroup-sizing-default">{key}</InputGroup.Text>
                        <Form.Control
                            name={key} type="text" value={mapProperties[key]}
                            placeholder="-" onChange={(e) => {
                                setMapProperties(mapProperties => ({
                                    ...mapProperties, [e.target.name]: e.target.value
                                }))
                            }}
                        />
                    </InputGroup>
                </Col>
            );
            _counter++;
        }
        setFormProperties(_array);
    }, [mapProperties]);

    /* Отрисовка формы */
    useEffect(() => {
        let _array = [];
        let _counter = 0;
        for (var key in mapData) {
            let _arrayAttributes = [];
            let _atrCounter = 0;
            /* Отрисовка атрибутов элемента */
            for (let atr in mapData[key]["attributes"]) {
                _arrayAttributes.push(
                    <InputGroup key={_atrCounter}>
                        <InputGroup.Text id="inputGroup-sizing-default">{atr}</InputGroup.Text>
                        <Form.Control
                            name={key} type="text" value={mapData[key]["attributes"][atr]}
                            placeholder="-" onChange={(e) => {
                                let _value = { ...mapData[e.target.name]["attributes"], [atr]: e.target.value };
                                setMapData(mapData => ({
                                    ...mapData, [e.target.name]: { ...mapData[e.target.name], attributes: _value }
                                }))
                            }}
                        />
                    </InputGroup>
                );
                _atrCounter++;
            }
            let addAtr;
            _arrayAttributes.push(
                <InputGroup key={_atrCounter} onSubmit={(e) => console.log(e)}>
                    <Form.Control
                        name={key} type="text"
                        placeholder="atribute"
                        value={addAtr}
                        onChange={(e) => addAtr = e.target.value}
                    />
                    <Button name={key} variant="outline-secondary" onClick={(e) => {
                        if (!addAtr) return;
                        let _value = { ...mapData[e.target.name]["attributes"], [addAtr]: "" };
                        setMapData(mapData => ({
                            ...mapData, [e.target.name]: { ...mapData[e.target.name], attributes: _value }
                        }))
                    }}>
                        Добавить / Очистить
                    </Button>
                </InputGroup>
            );

            /* Отрисовка элемента */
            _array.push(
                <Col xs={12} lg={6} className="mb-3" key={_counter}>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item>
                            <Accordion.Header>{key}</Accordion.Header>
                            <Accordion.Body>
                                <InputGroup>
                                    <InputGroup.Text id="inputGroup-sizing-default">{"type"}</InputGroup.Text>
                                    <Form.Control
                                        name={key} type="text" value={mapData[key]["type"]}
                                        placeholder="-" onChange={(e) => {
                                            let _value = { ...mapData[key], type: e.target.value };
                                            setMapData(mapData => ({
                                                ...mapData, [e.target.name]: _value
                                            }))
                                        }}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroup.Text id="inputGroup-sizing-default">{"value"}</InputGroup.Text>
                                    <Form.Control
                                        name={key} type="text" value={mapData[key]["value"]}
                                        placeholder="-" onChange={(e) => {
                                            let _value = { ...mapData[key], value: e.target.value };
                                            setMapData(mapData => ({
                                                ...mapData, [e.target.name]: _value
                                            }))
                                        }}
                                    />
                                </InputGroup>
                                <Col lg={12} className="mb-3">
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item>
                                            <Accordion.Header>{"Атрибуты"}</Accordion.Header>
                                            <Accordion.Body>
                                                {_arrayAttributes}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Col>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            );
            _counter++;
        }
        setFormData(_array);
    }, [mapData]);

    /* Загрузка SVG с сервера */
    useEffect(() => {
        fetch(`http://${window.location.hostname}:3010/api/map/image_id/${mapId}`)
            .then(response => response.text())
            .then(data => setSvgContent(data));
    }, [mapId])

    const drawMapElements = () => {
        if (svgContent) {
            let svg = new DOMParser().parseFromString(svgContent, 'text/html').body.childNodes[0];

            if (!svg.hasChildNodes()) return;
            let nodes = svg.childNodes;

            for (let i = 0; i < nodes.length; i++) {
                let _node = nodes[i].id;
                if (!_node || mapData[_node]) continue;
                setMapData(mapData => ({
                    ...mapData, [_node]: {
                        "type": "text",
                        "value": "text",
                        "attributes": {
                            "style": "fill:#000000;opacity:0.8"
                        }
                    }
                }))
            }
        }
    };


    /* Подгрузка списка карт */
    useEffect(() => {
        updateMapList();
    }, []);
    const updateMapList = () => {
        fetch(`http://${window.location.hostname}:3010/api/map/list`)
            .then((response) => response.json())
            .then((data) => {
                setMapList(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setMapList([]);
            });
    }

    /* Выбор карты на изменение */
    const chooseMap = (in_mapId) => {
        fetch(`http://${window.location.hostname}:3010/api/map/get/${in_mapId}`)
            .then((response) => response.json())
            .then((data) => {
                setMapData(data);
                setMapId(in_mapId);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setMapData({});
                setMapId(-1);
            });
        fetch(`http://${window.location.hostname}:3010/api/map/get_properties/${in_mapId}`)
            .then((response) => response.json())
            .then((data) => {
                setMapProperties(data);
                setMapId(in_mapId);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setMapProperties({});
                setMapId(-1);
            });
    };

    /* Обновить свойства карты */
    const handleSetPropeties = async () => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/map/update_properties/${mapId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mapProperties),
            });
            const result = await response.json();
            chooseMap(mapId);
            updateMapList();
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Обновить элементы карты */
    const handleSetElements = async () => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/map/update/${mapId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mapData),
            });
            const result = await response.json();
            chooseMap(mapId);
            updateMapList();
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Создать карту */
    const handleCreate = async () => {
        console.log(creationData);
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/map/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(creationData),
            });
            const result = await response.json();
            chooseMap(mapId);
            updateMapList();
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    /* Обновить элементы карты */
    const handleRemove = async () => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3010/api/map/remove/${mapId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            chooseMap(mapId);
            updateMapList();
            console.log(result);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <>
            <div className='container'>
                <Form.Select onChange={e => {
                    chooseMap(e.target.value);
                }}>
                    <option key={-1} value={-1}>{"--- Создать карту ---"}</option>
                    {mapList.map((item, i) =>
                        <option key={i} value={i}>{`[${i}] ${item}`}</option>
                    )}
                </Form.Select>
            </div>
            {mapId > -1 ? <>
                <div className='container'>
                    {formProperties}
                    <div className="d-grid gap-2">
                        <Button onClick={handleSetPropeties}>Сохранить основные параметры карты</Button>
                        <Button variant="danger" onClick={handleRemove}>Удалить карту</Button>
                    </div>
                </div>
                <div className='container'>
                    <Row className="mb-3">
                        {formData}
                    </Row>
                    <div className="d-grid gap-2">
                        <Button onClick={drawMapElements}>Получить элементы из svg</Button>
                        <Button onClick={handleSetElements}>Сохранить элементы карты</Button>
                    </div>
                </div>
            </> : <>
                <div className='container'>
                    {formCreation}
                    <Button onClick={handleCreate}>Создать новую карту</Button>
                </div>
            </>}
        </>
    );
};

export default MapEditor;
