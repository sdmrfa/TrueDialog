import { createBrowserRouter } from 'react-router-dom';
import Associate from '../pages/Associate';
import Install from '../pages/Install';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Associate />,
  },
  {
    path: '/install',
    element: <Install />,
  }
]);
