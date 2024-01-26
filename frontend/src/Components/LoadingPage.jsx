import { forwardRef } from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingPage = forwardRef(
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