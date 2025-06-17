import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import AxiosInstance from '../services/api';
import '../css/main.scss';

interface InstallButtonProps {
  hubspotOAuthCode: string | null;
}

const InstallButton: React.FC<InstallButtonProps> = ({
  hubspotOAuthCode,
}): JSX.Element => {
  const [requestStatus, setRequestStatus] = useState<number | null>(null);

  const installTrueDialogAppInHubspot = async () => {
    console.log("hubspotOAuthCode====>",hubspotOAuthCode)
    const result = await AxiosInstance.post(
      '/workflows/hubspot-app-redirect-url',
      {
        hubspotOAuthCode,
      }
    );
    console.log("Result===>",result)
    setRequestStatus(result.status);
  };

  return (
    <>
      {requestStatus === 200 && (
        <Container maxWidth="lg">
          <Box>
            <Alert severity="success" sx={{ marginBottom: '2rem' }}>
              App installed succesfully, you can now close this page.
            </Alert>
          </Box>
        </Container>
      )}
      {requestStatus !== null && requestStatus !== 200 && (
        <Container maxWidth="lg">
          <Box>
            <Alert severity="error" sx={{ marginBottom: '2rem' }}>
              An error occured while trying to install the app. Please, try again
              later.
            </Alert>
          </Box>
        </Container>
      )}
      <div className="wrapper">
        <Alert severity="warning" sx={{ marginBottom: '2rem' }}>
          After installing the TrueDialog app, every user must authenticate at Connected Apps in HubSpot
        </Alert>
        <Button
          variant="outlined"
          sx={{ marginTop: 5 }}
          onClick={installTrueDialogAppInHubspot}
        >
          Install TrueDialog App
        </Button>
      </div>
    </>
  );
};

export default InstallButton;
