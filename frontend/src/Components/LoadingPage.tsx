import { Spinner } from 'react-bootstrap';

type LoadingPageProps = {
  className?: string;
  fullScreen?: boolean;
}
const LoadingPage = ({ className, fullScreen }: LoadingPageProps) => {
  const fullScreenProp = fullScreen ?? true;

  return (
    <div className={`d-flex justify-content-center align-items-center ${fullScreenProp ? "vh-100" : ""} ${className}`}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

export default LoadingPage;