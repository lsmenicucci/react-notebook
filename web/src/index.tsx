import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';

import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/js/tabler.min.js'

import { App } from './App'

ReactDOM.render((<BrowserRouter><App /></BrowserRouter>), document.body)
