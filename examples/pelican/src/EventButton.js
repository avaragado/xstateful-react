import React from 'react';

import LightMachine from './LightMachine';
import Button from './Button';

const EventButton = ({ event, children }) => (
    <LightMachine
        render={({ transition }) => (
            <Button type="button" onClick={() => transition(event)} bg="#cc9">
                {children}
            </Button>
        )}
    />
);

export default EventButton;
