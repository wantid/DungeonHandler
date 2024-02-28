import React from 'react';
import { Button} from 'react-bootstrap';

const DungeonMaster = () => {
    /* Очистка списка игроков */
    const resetPlayers = () => {
        fetch(`http://${window.location.hostname}:3010/api/players/reset`)
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
            </div>
        </>
    );
};

export default DungeonMaster;