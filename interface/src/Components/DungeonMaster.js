import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const DungeonMaster = () => {
    const [imagesData, updateImagesData] = useState([]);

    /* Первичная подгрузка */
    useEffect(() => {
        handleUpdateImages();
    }, []);

    /* Подгрузка изображений */
    const handleUpdateImages = () => {
        fetch(`http://${window.location.hostname}:3010/api/images/list/`)
            .then((response) => response.json())
            .then((data) => {
                updateImagesData(data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                updateImagesData([]);
            });
    };

    /* Обновить изображение */
    const updateImage = (in_Image) => {
        fetch(`http://${window.location.hostname}:3010/api/images/set/${in_Image}`, {
            method: 'POST'
        })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Очистка списка игроков */
    const resetPlayers = () => {
        fetch(`http://${window.location.hostname}:3010/api/players/reset`)
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Следущий ход */
    const handleTurn = () => {
        fetch(`http://${window.location.hostname}:3010/api/turn/next`)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Завершить битву */
    const handleEndBattle = () => {
        fetch(`http://${window.location.hostname}:3010/api/turn/end`)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    /* Новая битва */
    const handleSort = (keyName) => {
        fetch(`http://${window.location.hostname}:3010/api/turn/sort/${keyName}`)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    const Header = ({ text }) => <h4 style={{ color: "white", marginBottom: 0, marginTop: "1rem" }}>{text}</h4>;

    return (
        <>
            <div className="d-grid gap-2 mb-2">
                <div className='header'>Основные команды:</div>
                {/* <Button variant="danger" type="submit" size="lg" onClick={resetPlayers}>
                    Очистить список игроков
                </Button> */}
                <div className="d-grid gap-2 mt-3">
                    <Button variant="success" onClick={() => handleTurn()} size="lg">
                        Следующий ход
                    </Button>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <Button variant="warning" onClick={() => handleSort("Инициатива")} size="lg">
                        Начать новую битву
                    </Button>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <Button variant="danger" onClick={() => handleEndBattle()} size="lg">
                        Завершить битву
                    </Button>
                </div>
                <div className='header'>Изображения:</div>
                <Row className="mb-3">
                    <Col xs={12} md={3} className="mb-3">
                        <Button variant="danger" onClick={() => updateImage("none.png")} className="container-fluid">
                            Очистить
                        </Button>
                    </Col>
                    {imagesData.map((item, i) =>
                        <Col xs={12} md={3} className="mb-3" key={i}>
                            <Button variant="primary" onClick={() => updateImage(item)} className="container-fluid" >
                                {item.split(".png")[0]}
                            </Button>
                        </Col>
                    )}
                </Row>
            </div>
        </>
    );
};

export default DungeonMaster;