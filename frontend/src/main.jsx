import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { preventZoom } from './utils/preventZoom';
import './index.css';
import App from './App.jsx';

preventZoom();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);