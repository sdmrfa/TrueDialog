import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import '../css/main.scss';
import Tutorial01 from '../assets/images/tutorial-01.png';
import Tutorial02 from '../assets/images/tutorial-02.png';
import Tutorial03 from '../assets/images/tutorial-03.png';
import Tutorial04 from '../assets/images/tutorial-04.png';
import Tutorial05 from '../assets/images/tutorial-05.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f8f8ff ',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Tutorial() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" className="tutorial">
        <Box sx={{ height: '100vh' }}>
          <Alert severity="warning" sx={{ marginBottom: '2rem' }}>
            Please, follow the tutorial below to learn how to get{' '}
            <b>Account ID</b> and <b>API key/secret</b> from TrueDialog
          </Alert>
          <Box>
            <Stack spacing={2}>
              <Item>
                <p>
                  1. Access your{' '}
                  <a href="https://ui.truedialog.com/" target="_blank">
                    TrueDialog
                  </a>{' '}
                  dashboard
                </p>
                <small>
                  If you don't have an account, click{' '}
                  <a
                    href="https://www.truedialog.com/register-free-15-day-trial/"
                    target="_blank"
                  >
                    here
                  </a>{' '}
                  to register
                </small>
              </Item>
              <Item>
                <p>2. Click on the menu at the top right corner</p>
                <img src={Tutorial01} height={500} />
              </Item>
              <Item>
                <p>
                  3. Click on the <b>API Keys</b> option
                </p>
                <img src={Tutorial02} />
              </Item>
              <Item>
                <p>
                  4. Click on the <b>New API Key</b> option
                </p>
                <img src={Tutorial03} height={500} />
              </Item>
              <Item>
                <p>
                  5. Type a <b>Label</b> for this API key, choose an account to
                  attach it, select <b>Common Key</b>, and finally, click on{' '}
                  <b>Add</b>
                </p>
                <img src={Tutorial04} />
              </Item>
              <Item>
                <p>
                  6. After creating a new API Key, copy <b>Account ID</b>,{' '}
                  <b>Key</b> and the <b>Secret</b>(You need to click on the{' '}
                  <i>eye</i> icon to show it).
                </p>
                <p>
                  Paste those values in the form at the top of the page and
                  submit
                </p>
                <img src={Tutorial05} height={500} />
              </Item>
            </Stack>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
