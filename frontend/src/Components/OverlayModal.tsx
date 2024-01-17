import { Dispatch } from '@reduxjs/toolkit';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { ModalAction } from '../store/modal/modal-store';

type OverlayModalProps = {
  visible: boolean;
  title: string;
  content: string;
  renderButtons: (onClose: () => void) => JSX.Element;
}

const OverlayModal = (props: OverlayModalProps) => {
  const dispatch = useDispatch<Dispatch<ModalAction>>();

  const handleClose = () => {
    dispatch({
      type: "SET_MODAL_VISIBLE",
      payload: false,
    })
  }

  return (
    <Modal show={props.visible}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.content}</p>
      </Modal.Body>
      <Modal.Footer>
        {props.renderButtons(handleClose)}
      </Modal.Footer>
    </Modal>
  );
};

export default OverlayModal;
