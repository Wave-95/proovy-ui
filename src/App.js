import './App.css';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import { SnackbarProvider } from './context/snackbar';

import { useState } from 'react';
import { Provider } from 'starknet';

function App() {
  const [account, setAccount] = useState(undefined);

  const provider = new Provider({
    baseUrl: 'https://alpha4.starknet.io',
    feederGatewayUrl: 'feeder_gateway',
    gatewayUrl: 'gateway',
  });

  return (
    <div className="App">
      <SnackbarProvider>
        <Navbar account={account} setAccount={setAccount} />
        <Dashboard account={account} provider={provider} />
      </SnackbarProvider>
    </div>
  );
}

export default App;
