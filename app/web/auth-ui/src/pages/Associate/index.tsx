import { useSearchParams } from 'react-router-dom';
import Welcome from '../../components/Welcome';
import APIKeysForm from '../../components/APIKeysForm';
import Tutorial from '../../components/Tutorial';

const Home: React.FC = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <Welcome pageType='Account Association' />
      <APIKeysForm portalId={searchParams.get('portalId')} userEmail={searchParams.get('userEmail')} userId={searchParams.get('userId')}/>
      <Tutorial />
    </div>
  );
};

export default Home;
