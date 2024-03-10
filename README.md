# Capstone project 2024

### Languages / Technologies

* > **Typescript** - this app uses Typescript on the frontend. Typescript is basically Javascript, but as statically typed. This creates a type-safe environment with compile-time type checking, whereas with normal Javascript, you don't get the compile-time type checking, and you only run into type errors on the runtime, which can be extremely difficult to debug

* > **Python** - Not my first language of choice, but it has some pretty nice features in it. For example, decorators. Python is a dynamically typed language that uses indentation for code blocks

* > **React** - React is a component based Javascript UI library that mainly handles rendering on the frontend instead of the backend. React has a concept called hooks, which allow for some advanced custom functionality. One of the most fundamental hooks is the **useState** hook, which stores state that when changed causes the component to re-render

* > **Redux** - Redux is a library that allows for global state to be stored. Redux isn't exclusive to React, but in my project, I use React Redux, which **is** a library specifically for React

* > **Flask** - used for API development in Python

* > **Marshmallow** - a library used for creating database schemas that allow for dynamic database manipulation

* > **SQL** - The database language for storing the site data

* > **Bootstrap** - A style library that makes styling components super easy. I use React Bootstrap, which is a React exclusive library that allows a little more than just styling, but also functionality

### Hooks

* **useFormField** - probably the most advanced custom hook in this app. This hook creates a form field that does validity checking based on the provided validity function
This hook is type safe, which means there are no "any" types where the compiler doesn't know. This is done using generics, which allow for type parameters to be passed in that could be anything according to the constraint. This allows the hook to reference previous values the user put in, and extract a type from that.

```typescript
const [component, isValid, setInputValid] = useFormField(
  // Title
  "Input field title",

  // The input element's "value" prop
  "value",

  // Field validation
  (value /* String, because of the "value" selector above */) => {
    if (value.length === 0) return "This field is required!";

    if (value.length > 128) return "Maximum of 128 characters!";
  },

  // Default value
  "Default title",

  // Options
  {
    // Required option
    elementType: "input",

    // Optional options
    showInitialValidity: true,
    className: "my-element",
    props: {},
    onChange: (value) => {
      console.log("The value is", value);
    }
  }
)
```

* **useModal** - This hook takes React Bootstrap's modal component, and provides simplicity to the usage. In the code, a model element gets placed beside the root element in the HTML.
Usage:

```tsx
const [element, setVisible] = useModal(
  // Title
  "Modal title",

  // Content
  "The modal content",

  // Render callback
  (closeHandler /* The close handler provided by the modal hook that closes the modal */) => {
    return (
      <button type="submit">Submit</button>
      <button type="button" onClick={closeHandler}>Close</button>
    )
  }
)
```