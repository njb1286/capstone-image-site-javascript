import { Modal } from 'react-bootstrap';

import classes from "./OverlayModal.module.scss";

/**
 * @param {{
 *  visible: boolean;
 *  title: string;
 *  content: string;
 *  renderedButtons: JSX.Element;
 *  onClose: () => void;
 * }} props 
 */

const OverlayModal = (props) => {
  return (
    <Modal show={props.visible} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title className={classes.title}>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={classes.content}>{props.content}</p>
      </Modal.Body>
      <Modal.Footer className={classes.buttons}>
        {props.renderedButtons}
      </Modal.Footer>
    </Modal>
  );
};

export default OverlayModal;
