import { Container, Card } from "react-bootstrap";
import classes from "./AboutPage.module.scss";

function AboutPage() {
  return (
    <Container>
      <Card.Body className={classes.content}>
        <Card.Title className={`text-center ${classes.title}`}>About</Card.Title>

        <Card.Text>
          Ea aliquip mollit fugiat eiusmod Lorem consequat est. Cillum ut sint et deserunt esse occaecat nulla laboris proident. Magna ipsum eu commodo tempor mollit nulla eu ullamco.
        </Card.Text>

        <ul>
          <li>Fugiat incididunt aliqua excepteur esse eiusmod.</li>
          <li>Sunt cupidatat amet velit qui labore nulla dolor officia est eu.</li>
          <li>Ut laboris esse minim sunt occaecat veniam elit laboris sit nisi aliqua sit adipisicing.</li>
          <li>Laboris eiusmod reprehenderit reprehenderit irure amet velit occaecat.</li>
        </ul>

        <Card.Text>
          Sint aliquip dolore fugiat consectetur nisi commodo ad nostrud amet cupidatat cupidatat est esse. Tempor consectetur anim mollit ex sit pariatur fugiat cupidatat veniam officia aliquip aliqua. Aute anim duis Lorem officia ea Lorem deserunt pariatur. Adipisicing proident irure pariatur id laborum officia.
        </Card.Text>

        <Card.Text>
          Reprehenderit voluptate commodo culpa Lorem fugiat aliqua adipisicing voluptate enim non incididunt excepteur do aute. Consectetur sit non aliqua ullamco occaecat exercitation elit ipsum laboris ad et aute cillum duis. Non qui aute aute non exercitation adipisicing consequat aliqua exercitation cillum ut sint. Cillum et incididunt velit ipsum. Mollit sunt mollit consectetur voluptate aliqua. Labore labore proident ut pariatur reprehenderit nulla nostrud consectetur. Sunt fugiat ipsum tempor incididunt occaecat officia enim id ipsum irure nisi eu laboris culpa. Do tempor esse proident tempor laboris commodo veniam aliquip veniam eiusmod. Aliquip mollit cillum sunt dolor.
        </Card.Text>
      </Card.Body>
    </Container>
  );
}

export default AboutPage;
