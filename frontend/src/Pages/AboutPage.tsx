import { Container, Card } from "react-bootstrap";
import classes from "./AboutPage.module.scss";

function AboutPage() {
  return (
    <Container>
      <Card.Body className={classes.content}>
        <h1 className={`text-center ${classes.title}`}>About this site</h1>

        <h1>Why I built this</h1>

        <p>
          This site is made for my DevCamp Capstone project. It is a simple image uploading site that stores 
          images in a database and displays them on the home page. The images can be filtered by category and 
          sorted by date or title. The images can also be searched by title.
        </p>

        <h1>The styling</h1>

        <p>
          For the styling, instead of using the typical "px", I use "rem". This allows me to set the root size
          of the app in the :root selector in the main style file. This way, if I need to make the size of
          the whole app bigger, I need only change the root size and everything will scale accordingly. This
          is super useful for website scalability.
          <br />
          I also used React Bootstrap to help with the styling. It is a great library that makes it easy to
          create a responsive website.
        </p>

        <h1>Vite</h1>

        <p>
          I used Vite to build this site. Vite is a build tool that is super fast. It is much faster than
          Create React App. It also has a lot of great features that make it a great choice for building
          websites. Vite's dependency list is also much smaller than Create React App's, which allows the
          bundle size to be smaller.

          <br />
          <br />

          Vite's Hot Module Replacement is also super fast. It is so fast that it feels like the changes
          are instant. This is super useful for development, as it allows for a much faster feedback loop.
          Vite's Hot Module Replacement also doesn't lose the state of the app, which is super useful for
          debugging.
        </p>

        <h1>Typescript</h1>

        <p>
          The version of this site you get may or may not be written in Typescript. However, this site was
          originally written in Typescript. I find Typescript to be far superior to Javascript because of
          the strict type checking. It makes it much easier to catch bugs before runtime, whereas with
          normal Javascript, type errors only show up at runtime and can be super hard to track down as
          a result. Furthermore, Typescript also allows the interpreter to give better suggestions for
          autocompletion, which is super useful, and boosts productivity. I have been writing Javascript
          for a long time now, but when I stumbled across Typescript, my entire world of coding changed,
          as I unapologetically prefer static typing over dynamic typing now.

          <br />
          <br />
          
          However, with Vite + Typescript, Vite actually skips Type checking for the runtime. This makes
          the compile step much faster. The type checking is simply done in the editor.
        </p>

        <h1>Hooks</h1>

        <p>
          In this site, I use a lot of hooks. One of the most complex hooks in this site is the useFormField
          hook. This hook makes it easy to create a form field that has validation, error messages, and fancy
          indicators. It also means that I can use the hook in multiple places, which makes the code more
          scalable and maintainable.
        </p>
      </Card.Body>
    </Container>
  );
}

export default AboutPage;
