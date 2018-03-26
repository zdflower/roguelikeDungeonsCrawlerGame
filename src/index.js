import React from 'react';
import ReactDOM from 'react-dom';

import Juego from './components/Juego';

import registerServiceWorker from './registerServiceWorker';


class App extends React.Component {
  render() {
    return <Juego />
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();