import React from 'react';

import LightMachine from './LightMachine';
import Button from './Button';

const ResetButton = ({ children }) => (
    <LightMachine
        render={({ init }) => (
            <Button type="button" onClick={init} color="white" bg="#f55">
                {children}
            </Button>
        )}
    />
);

export default ResetButton;
