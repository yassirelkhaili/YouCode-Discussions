import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import App from './App';
import Header from './layout/Header';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const header = ReactDOM.createRoot(
  document.getElementById('header') as HTMLElement
);

root.render(
<App />
);

header.render(
<Header />
);