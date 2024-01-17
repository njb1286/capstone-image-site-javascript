import { Modal } from 'react-bootstrap';

import classes from "./OverlayModal.module.scss";

type OverlayModalProps = {
  visible: boolean;
  title: string;
  content: string;
  renderedButtons: JSX.Element;
}

const OverlayModal = (props: OverlayModalProps) => {
  return (
    <Modal show={props.visible}>
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
