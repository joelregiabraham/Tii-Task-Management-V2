//import React from 'react';
//import ReactDOM from 'react-dom/client';
//import './index.css';
//import App from './App.jsx';

//ReactDOM.createRoot(document.getElementById('root')).render(
//    <React.StrictMode>
//        <App />
//    </React.StrictMode>
//);

import React from 'react';
import ReactDOM from 'react-dom/client';

// First import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Then import Bootstrap JavaScript for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Now import your custom styles (in order from most general to most specific)
import './styles/theme.css';     // Our theme variables and global settings
import './styles/App.css';       // Application-wide styles
import './index.css';            // Keep this if it has important global styles

// Finally import your App component
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);