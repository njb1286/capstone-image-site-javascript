import { forwardRef } from 'react';
import { Spinner } from 'react-bootstrap';

type LoadingPageProps = {
  className?: string;
  fullScreen?: boolean;
}
const LoadingPage = forwardRef<HTMLDivElement, LoadingPageProps>(
  /**
   * @param {{
   *  className?: string;
   *  fullScreen?: boolean;
   * }} props 
   * @param {MutableRefObject<HTMLDivElement>} ref 
   * @returns 
   */
  (props, ref) => {
    const fullScreenProp = props.fullScreen ?? true;

    return (
      <div ref={ref} className={`d-flex justify-content-center align-items-center ${fullScreenProp ? "vh-100" : ""} ${props.className ?? ""}`}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  })

export default LoadingPage;