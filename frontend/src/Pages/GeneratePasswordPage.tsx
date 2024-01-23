import { Form } from 'react-bootstrap';

const GeneratePasswordPage = () => {
  return (
    <Form>
      <Form.Group controlId="formField">
        <Form.Label>Enter a value:</Form.Label>
        <Form.Control type="text" placeholder="Enter a value" />
      </Form.Group>
    </Form>
  );
};

export default GeneratePasswordPage;