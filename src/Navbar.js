import { Button, Grid, Typography } from '@mui/material';
import { connect } from '@argent/get-starknet';
import { ellipse } from './utils';

export default function Navbar({ account, setAccount }) {
  async function connectWallet() {
    const starknet = await connect();
    if (starknet) {
      await starknet.enable();
    }
    if (starknet?.account?.address) {
      setAccount(starknet.account);
    }
  }

  async function disconnectWallet() {
    setAccount(undefined);
  }

  return (
    <Grid container spacing={2} style={{ borderBottom: '1px solid lightgrey', padding: '24px 32px' }}>
      <Grid container item xs={4} justifyContent="left" alignItems="center">
        <Typography style={{ fontFamily: 'Lobster' }} variant="h3">
          Proovy
        </Typography>
      </Grid>
      <Grid container item xs={8} justifyContent="right" alignItems="center">
        <Button onClick={account?.address ? disconnectWallet : connectWallet} variant="outlined">
          {ellipse(account?.address) || 'Connect Wallet'}
        </Button>
      </Grid>
    </Grid>
  );
}
