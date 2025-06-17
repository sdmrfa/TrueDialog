import '../css/main.scss';
import TDFullLogo from '../assets/images/truedialog-full-logo.png';

interface WelcomeProps {
  pageType: string;
}

const Welcome: React.FC<WelcomeProps> = ({
  pageType,
}): JSX.Element => {
  return (
    <>
      <div className="wrapper">
        <img className="wrapper-logo" src={TDFullLogo} />
        <h1>HubSpot {pageType}</h1>
      </div>
    </>
  );
};

export default Welcome;
