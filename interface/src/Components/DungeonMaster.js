import React from 'react';
import { Button } from 'react-bootstrap';

const DungeonMaster = () => {

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

    /* Новая битва */
    const handleSort = (keyName) => {
        fetch(`http://${window.location.hostname}:3010/api/turn/sort/${keyName}`)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
            });
    };

    return (
        <>
            <div className="d-grid gap-2 mb-2">
                <Button variant="danger" type="submit" size="lg" onClick={resetPlayers}>
                    Очистить список игроков
                </Button>
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
            </div>
        </>
    );
};

export default DungeonMaster;