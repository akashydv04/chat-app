import React from 'react';
import { Col, Grid, Row } from 'rsuite';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { RoomsProvider } from '../context/rooms.context';
import Chat from './home/Chat';
import { useMediaQuery } from '../misc/custom-hook';

const Home = () => {
  const isDesktop = useMediaQuery('(min-width:992px)');
  const { isExact } = useRouteMatch();
  const canRenderSideBar = isDesktop || isExact;
  {
    console.log('sign in');
  }
  return (
    <RoomsProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {canRenderSideBar && (
            <Col xs={24} md={8} className="h-100">
              <SideBar />
            </Col>
          )}
          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100">
                <Chat />
              </Col>
            </Route>
            <Route>
              {isDesktop && (
                <Col xs={24} md={16} className="h-100">
                  <h6 className="text-center mt-page">Please select chat</h6>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomsProvider>
  );
};

export default Home;
