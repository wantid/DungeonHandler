import './App.css';

import React, { useRef } from 'react';
import { AddToHomeScreen } from 'react-pwa-add-to-homescreen';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';

import { PlayerCreate, PlayersList, PlayersTurn, PlayerView } from './Components/PlayerForms';
import DungeonMaster from './Components/DungeonMaster';
import MapData from './Components/MapData';
import MapEditor from './Components/MapEditor';
import { StoryView, RulesView } from './Components/InfoData';


function App() {

  const dmListRef = useRef();
  const playerViewRef = useRef();
  const playerTurnRef = useRef();
  const dmTurnRef = useRef();

  return (
    <>
      <div className='app__background' />
      <div className='app__viewport'>
        <BrowserRouter>
          <Routes>
            <Route index element={
              <Tabs
                defaultActiveKey="players"
                className="mb-3"
                onSelect={() => { playerViewRef.current.updateList(); playerTurnRef.current.updateList(); }}
              >
                <Tab eventKey="players" title="Персонажи">
                  <PlayersList
                    ref={playerViewRef}
                    playersFilter={{ key: "В игре", filter: (keyValue) => { return keyValue > 0; } }}
                  />
                </Tab>
                <Tab eventKey="turn" title="Ход игры">
                  <PlayersTurn ref={playerTurnRef} />
                </Tab>
                <Tab eventKey="rulesView" title="Правила">
                  <RulesView />
                </Tab>
              </Tabs>
            } />
            <Route path="dm" element={
              <Tabs
                defaultActiveKey="players"
                className="mb-3"
                onSelect={() => { dmListRef.current.updateList(); dmTurnRef.current.updateList(); }}
              >
                <Tab eventKey="createPlayer" title="Создать персонажа">
                  <PlayerCreate />
                </Tab>
                <Tab eventKey="players" title="Персонажи" >
                  <PlayersList ref={dmListRef} ismaster={true} />
                </Tab>
                <Tab eventKey="turn" title="Ход игры">
                  <PlayersTurn ref={dmTurnRef} />
                </Tab>
                <Tab eventKey="mapData" title="Карта">
                  <MapData />
                </Tab>
                <Tab eventKey="dm" title="ДМ">
                  <DungeonMaster />
                </Tab>
                <Tab eventKey="storyView" title="История">
                  <StoryView />
                </Tab>
                <Tab eventKey="rulesView" title="Правила">
                  <RulesView />
                </Tab>
                <Tab eventKey="mapEditor" title="Редактор карт">
                  <MapEditor />
                </Tab>
              </Tabs>
            } />
          </Routes>
        </BrowserRouter>
        <AddToHomeScreen />
      </div>
    </>
  );
}

export default App;
