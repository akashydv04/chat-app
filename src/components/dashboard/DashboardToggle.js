import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModelState } from '../../misc/custom-hook';
import Dashboard from '.';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModelState();

  const isMobile = useMediaQuery('(max-width:992px)');

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard"> Dashboard</Icon>
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
