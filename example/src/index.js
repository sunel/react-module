import { render } from 'react-dom';
import { run } from 'react-module';
import AppModule from './modules/App'

import './index.css';

render(
    run(AppModule, process.env.NODE_ENV === 'production'), 
    document.getElementById('root')
);

