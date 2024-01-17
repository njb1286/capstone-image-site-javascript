import { Button, Modal } from 'react-bootstrap';

type OverlayModalProps = {
  visible: boolean;
  title: string;
  content: string;
  renderButtons: () => JSX.Element;
}

const OverlayModal = (props: OverlayModalProps) => {
  return (
    <>
      <Button variant="primary">
        Open Modal
      </Button>

      <Modal show={props.visible}>
        <Modal.Header closeButton>
          <Modal.Title>My Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This is the content of my modal.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OverlayModal;
