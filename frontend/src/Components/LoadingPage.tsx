import { forwardRef } from 'react';
import { Spinner } from 'react-bootstrap';

type LoadingPageProps = {
  className?: string;
  fullScreen?: boolean;
}
const LoadingPage = forwardRef<HTMLDivElement, LoadingPageProps>(
  (props, ref) => {
    const fullScreenProp = props.fullScreen ?? true;

    return (
      <div ref={ref} className={`d-flex justify-content-center align-items-center ${fullScreenProp ? "vh-100" : ""} ${props.className ?? ""}`}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  })

export default LoadingPage;