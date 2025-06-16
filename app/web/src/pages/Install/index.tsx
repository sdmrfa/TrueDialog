import { useSearchParams } from 'react-router-dom';
import Welcome from '../../components/Welcome';
import InstallButton from '../../components/InstallButton';

const Home: React.FC = (): JSX.Element => {
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get('code');
  console.log("codeParam===>",codeParam)
  return (
    <div>
      <Welcome pageType='App Installation'/>
      <InstallButton hubspotOAuthCode={codeParam}/>
    </div>
  );
};

export default Home;
