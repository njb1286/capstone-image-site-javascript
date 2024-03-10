# Capstone project 2024

### Description
For my capstone project, I have created an image uploader website that stores all the uploaded data in an SQL database. Conceptually, the idea is simple, but I focused on efficiency. 

I tried to make it not download all the items at the same time by implementing "infinite scrolling", so it would download the items as needed. However, my problem was knowing which category had already been downloaded with the category filter. So, I decided to scrap the idea, because this isn't a production application. However, that doesn't mean nothing is done efficiently. I still have lazy component loading, which means the code for a component is only downloaded when the component is used.

I implemented a password for the site. It's very simple, but it gets the job done. I also added a generate single use password. It all works by storing a token in the localStorage, and giving it to the Python backend when necessary.

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

* **useLazyImage** - This hook is used for creating an image that only downloads when the user can see it. Before the image is fully downloaded, the user gets to see a nice blurry preview that is a tiny scaled version of the image with some fancy styling.
It uses an `IntersectionObserver` to observe when the client can see this item. An `IntersectionObserver` is a default library class in Javascript
Usage:

```typescript
const [imageElement, reobserve /* A function to reobserve the element if needed with the IntersectionObserver */] = useLazyImage(
  // Id
  0,

  // Title
  "An image of a dog",

  // Options
  {
    wrapperClassName: "image-wrapper",
    imageClassName: "image",
    loadingImageClassName: "loading-image",
    size: "medium",
    defaultImageShouldLoad: false,
  }
)
```

* **useGetImageItem** - This hook uses a provided id to retrieve an image item. If that id exists in the global state, it returns that. If not, then it sends a fetch request, adds the returned item to the global state (if it exists in the database), and then returns that item.
Usage:

```typescript
const { isError, imageItem } = useGetImageItem(13);
```

### Components

* **Card** - An image item card that displays the title and image. This component uses the `useLazyImage` hook for the image
Usage:

```tsx
<Card 
  id={13}
  title="A dog"
  description="Description of an image of a dog"
  date="5/13/24"
  category="Animals"
  /* A state that when changed, re-observes the image with the useLazyImage hook's reobserve function */
  stateToListenTo={globalState.imageItems}
/>
```

* **DropDown** - A fancy dropdown component supported by React Bootstrap. This component only allows the value types provided to be passed in. For example, if the dropdown has the selectable items:
  * Dog
  * Cat
  * Horse
  * Mouse

  Then with the onSelect function, the argument type is a union of the items:
  `"Dog" | "Cat" | "Horse" | "Mouse"`
  
  Which means that the type can be any of these strings, but it cannot be anything else.

  Usage:

```tsx
<DropDown 
  categories={["Dog", "Cat", "Horse", "Mouse"]}
  defaultValue="Dog"
  onSelect={(value) => {
    console.log("The value is", value);
  }}

  /* Optional props */
  title="Animal"
  className="animals-dropdown"
/>
```

* **OverlayModal** - The modal component that the `useModal` hook uses.
Usage:

```tsx
<OverlayModal 
  visible={true}
  title="Delete item"
  content="Are you sure you want to delete this item?"
  renderedButtons={
    <>
      <button>Confirm</button>
      <button>Cancel</button>
    </>
  }
  onClose={() => {
    console.log("Close modal");
  }}
/>
```

* **UploadForm** - The full form of this app (e.g. title, image, description, category)
Usage:

```tsx
<UploadForm 
  /* Note: all of the props here are optional */
  onSubmit={async (formData) => {
    const response = await fetch("*url*", {
      method: "POST",
      body: formData
    })
    if (response.status > 299) return true; // Return true if an error occurred

    console.log("Title", formData.get("title"));
  }}

  onCancel={() => {
    console.log("Canceled");
  }}

  defaultTitle="Default title field value"
  defaultDescription="Default description field value"
  defaultCategory="All"

  /* If it should validate all the input fields initially */
  validateFieldsOnMount={true}

  /* If it should validate the image field */
  shouldNotValidateImage={true}
/>
```