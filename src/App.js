import './App.css';
import Navbar from './Navbar';
import { useState } from 'react';

function App() {
  const [accountDetails, setAccountDetails] = useState({});
  
  return (
    <div className="App">
      <Navbar accountDetails={accountDetails} setAccountDetails={setAccountDetails} />
    </div>
  );
}

export default App;
