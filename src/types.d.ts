
import * as React from 'react';

export interface Module {
    boot?: () => void;
} 

declare function run(Component: Module): React.Component