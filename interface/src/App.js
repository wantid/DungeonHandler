import './App.css';

import React, { useRef } from 'react';

import { PlayerCreate, PlayersList, PlayersTurn } from './Components/PlayerForms';
import DungeonMaster from './Components/DungeonMaster';
import { Tab, Tabs } from 'react-bootstrap';

function App() {

  const playerListRef = useRef();
  const playerTurnRef = useRef();

  return (
    <div className='app__viewport'>
      <Tabs
        defaultActiveKey="players"
        className="mb-3"
        onSelect={() => {playerListRef.current.updateList(); playerTurnRef.current.updateList();}}
      >
        <Tab eventKey="createPlayer" title="Создать персонажа">
          <PlayerCreate />
        </Tab>
        <Tab eventKey="players" title="Персонажи">
          <PlayersList ref={playerListRef} />
        </Tab>
        <Tab eventKey="turn" title="Ход игры">
          <PlayersTurn ref={playerTurnRef}/>
        </Tab>
        <Tab eventKey="dm" title="ДМ">
          <DungeonMaster />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
