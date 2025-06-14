import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { Buffer } from "buffer";
if (!window.Buffer) {
    window.Buffer = Buffer;
}

createRoot(document.getElementById("root")!).render(<App />);
