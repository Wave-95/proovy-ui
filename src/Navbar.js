import { Button, Grid } from '@mui/material';
import { connect } from '@argent/get-starknet';

export default function Navbar({ accountDetails, setAccountDetails }) {
  async function connectWallet() {
    const starknet = await connect();
    if (starknet) {
      await starknet.enable();
    }
    if (starknet?.account?.address) {
      setAccountDetails({ address: starknet.account.address });
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <div>Proovy Logo</div>
      </Grid>
      <Grid item xs={8}>
        <Button onClick={connectWallet}>{accountDetails?.address || 'Connect Wallet'}</Button>
      </Grid>
    </Grid>
  );
}
