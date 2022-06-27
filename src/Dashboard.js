import { Button, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Contract, number, shortString, getChecksumAddress, validateChecksumAddress } from 'starknet';

import deployerAbi from './abis/deployer_abi.json';
import { useSnackbar } from './context/snackbar';
import { ellipse } from './utils';

export default function Dashboard({ account, provider }) {
  const CONTRACT_ADDRESS = '0x00e2ffbb3ba80f71391fb4ed6627718b0da64d9bdac5fdad5ff1cb01640d91c0';
  const accountOrProvider = account || provider;
  const contract = new Contract(deployerAbi, CONTRACT_ADDRESS, accountOrProvider);
  const localTxHash = localStorage.getItem('proovy_tx_hash');

  const { setError, setInfo } = useSnackbar();

  //Tx states
  const [txHash, setTxHash] = useState();
  const [txReceipt, setTxReceipt] = useState();

  //Form states
  const [name, setName] = useState('NFT Collection Name');
  const [symbol, setSymbol] = useState('ABC');
  const [owner, setOwner] = useState('StarkNet Account Address');

  async function deployContract() {
    if (!account?.address) {
      return setError('Please connect your wallet!');
    }

    try {
      const encodedName = shortString.encodeShortString(name);
      const encodedSymbol = shortString.encodeShortString(symbol);
      try {
        const checksummedAddress = getChecksumAddress(owner);
        const isValidAddress = validateChecksumAddress(checksummedAddress);
        if (!isValidAddress) {
          return setError('Invalid owner address.');
        }
      } catch (e) {
        return setError('Invalid owner address.');
      }
      const response = await contract.deploy_erc721_contract(encodedName, encodedSymbol, owner, {
        maxFee: number.toBN(2),
      });
      const resTxHash = response?.transaction_hash;
      localStorage.setItem('proovy_tx_hash', resTxHash);
      setTxHash(resTxHash);
      setInfo(`Contract deployment in progress: ${resTxHash}`);
    } catch (e) {
      setError('User Rejected Tx');
    }
  }

  //NFT contract address is emitted as event in second data field
  function getNftContractAddress(txReceipt) {
    return txReceipt?.events[1]?.data;
  }

  useEffect(() => {
    async function getTransactionReceipt() {
      const txReceipt = await provider.getTransactionReceipt(localTxHash);
      setTxReceipt(txReceipt);
    }
    if (localTxHash) {
      getTransactionReceipt();
    }
  }, [txHash]);

  useEffect(() => {
    if (account?.address) {
      setOwner(account?.address);
    }
  }, [account]);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleSymbolChange(event) {
    setSymbol(event.target.value);
  }

  function handleOwnerChange(event) {
    setOwner(event.target.value);
  }

  function renderVoyagerLink(txReceipt) {
    return (
      <a
        href={`https://goerli.voyager.online/contract/${getNftContractAddress(txReceipt)}#readContract`}
        target="_blank"
        rel="noreferrer"
      >
        View Contract on Voyager Explorer
      </a>
    );
  }

  return (
    <Grid container spacing={2} justifyContent="space-evenly" style={{ padding: '50px' }}>
      <Grid container item xs={5} direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Typography variant="h2" align="left">
          Provenance
        </Typography>
        <Typography variant="h4" align="left">
          That begins with <span style={{ textDecoration: 'underline' }}>you</span>
        </Typography>
        <img src="generic-nft-art.svg" style={{ height: '400px', marginTop: '60px', transform: 'rotate(180deg)' }} />
      </Grid>
      <Grid container item xs={5} direction="column">
        <Typography variant="h6" style={{ marginTop: '32px' }}>
          Deploy your own NFT Collection
        </Typography>
        <Typography variant="subtitle">
          <i>StarkNet Goerli</i>
        </Typography>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          size="small"
          margin="dense"
          value={name}
          onChange={handleNameChange}
          style={{ marginTop: '32px' }}
        />
        <TextField
          id="symbol"
          label="Symbol"
          variant="outlined"
          size="small"
          margin="dense"
          value={symbol}
          onChange={handleSymbolChange}
          style={{ marginTop: '16px' }}
        />
        <TextField
          id="owner"
          label="Owner"
          variant="outlined"
          size="small"
          margin="dense"
          value={owner}
          onChange={handleOwnerChange}
          style={{ marginTop: '16px' }}
        />
        <Button onClick={deployContract} fullWidth variant="contained" style={{ marginTop: '16px' }}>
          Deploy Contract
        </Button>
        <Typography variant="h6" style={{ marginTop: '32px' }}>
          Deployment Status
        </Typography>
        <Box style={{ border: '1px solid lightgrey', padding: '16px' }}>
          <Typography align="left" variant="body">{`Latest Deployment: ${
            txReceipt?.transaction_hash ? ellipse(txReceipt?.transaction_hash) : 'None'
          }`}</Typography>
          <Typography>{`Transaction Status: ${txReceipt?.status || 'N/A'}`}</Typography>
          <Typography>{`NFT Contract Address: ${
            getNftContractAddress(txReceipt) || 'Waiting on deployment (Refresh)'
          } `}</Typography>
          {getNftContractAddress(txReceipt) ? renderVoyagerLink(txReceipt) : null}
        </Box>
      </Grid>
      <Grid item xs={8}></Grid>
      {txHash ? (
        <Box>
          <div>{`NFT Contract is being deployed`}</div>
          <div>{`Tx Hash: ${txHash}`}</div>
        </Box>
      ) : null}
    </Grid>
  );
}
