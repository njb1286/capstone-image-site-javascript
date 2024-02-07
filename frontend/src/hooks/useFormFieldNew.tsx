import { ChangeEvent, ElementType, FocusEvent, useEffect, useRef, useState } from "react";
import { Form, FormControl, FormControlProps, FormGroup } from "react-bootstrap";

type ErrorMessage = string | null | undefined;

// All the optional data for the hook
const defaultOptions = {
  /**
  * If true, the input will show the error message if it is invalid on initial render.
  * You can set the default value of the input by passing in the "defaultValue" prop in
  * the @var componentProps object defined above. This argument is optional
  */
  showInitialValidity: false,

  // The class name of the Bootstrap FormGroup that surrounds the input and labels (optional)
  className: undefined as string | undefined,

  // The default value of this field
  defaultValue: undefined,
}



export function useFormFieldNew<T extends "input" | "textarea", U extends string | number>(
  // The element type (as a string, must be "input" or "textarea")
  elementType: T,

  // The placeholder for the input
  title: string,

  // The props that get used for the FormControl component (constrained to what you can pass in to the FormControl component)
  componentProps: FormControlProps,

  /**
   * A callback function that gives the hook access to the desired property of the element
   * provided by the user of this hook. Usage examples:
   * (element) => element.value
   * (element) => element.checked
   * (element) => element.files
   */
  getElementValue: (elementPointer: HTMLElementTagNameMap[T]) => U,

  /**
   * A callback function that takes in a reference to the element that gets used in this hook,
   * and returns a string or null. If it returns a string, that string is used as the error
   * message, and if it returns null, the input is considered valid. This function gets called
   * on each key stroke to keep it updated.
   */
  isValidCallback: (value: U) => ErrorMessage,

  options = defaultOptions,
) {
  type InputElementType = HTMLElementTagNameMap[T];

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);
  const [isTouched, setIsTouched] = useState(false);
  const [inputValue, setInputValue] = useState<U | undefined>(options.defaultValue);
  const fieldElementRef = useRef<InputElementType>(null);

  /**
   * Runs on initial render. If the showInitialValidity is true, it will set the isTouched to true and
   * set the errorMessage to the result of the isValidCallback that gets passed in. Because it sets
   * "isTouched" to true, the input will show the error message if it is invalid.
   */
  useEffect(() => {
    if (options.showInitialValidity) {
      setIsTouched(true);

      const value = getElementValue(fieldElementRef.current!);
      setErrorMessage(isValidCallback(value));
    }
  }, []);

  const changeHandler = (event: ChangeEvent<InputElementType>) => {
    const value = getElementValue(event.target);

    setErrorMessage(isValidCallback(value));

    setInputValue(value);
  }

  const focusHandler = () => {
    setIsTouched(false);
  }

  const blurHandler = (event: FocusEvent<InputElementType>) => {
    setIsTouched(true);

    const value = getElementValue(event.target);
    setErrorMessage(isValidCallback(value));
  }

  /**
   * @var isValid
   * The errorMessage can be a string or null. This converts it into a boolean.
   * It uses some Javascript properties to accomplish this:
   * 
   * 1. If errorMessage is null, it is falsy.
   * 2. If errorMessage is a string, and is not empty, it is truthy.
   */
  const isValid = !errorMessage;

  const component = (
    <FormGroup className={options.className}>
      <Form.Label>{title}</Form.Label>
      <FormControl
        /** Each prop passed in to the @var componentProps argument */
        {...componentProps}

        /** The "as" prop takes in a string that represents an HTML element, and renders as that element */
        as={elementType as ElementType}
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}

        // Bootstrap's fancy validity styling (adds a green border if valid, and a red border if invalid)
        isValid={isTouched && isValid}
        isInvalid={isTouched && !isValid}

        value={inputValue}
        ref={fieldElementRef}
      />

      <Form.Label style={{
        /**
         * Hide this label instead of removing it from the DOM or removing it's text content. The reason 
         * for this is because if it gets removed from the DOM, it will shift the other elements.
         */
        visibility: isTouched && !isValid ? "visible" : "hidden",
      }} className="text-danger">{isTouched && !isValid ? errorMessage : "valid"}</Form.Label>
    </FormGroup>
  )

  // Returns the component, the (updated) validity state, the input value, and a function to set the input value
  return [component, isValid, inputValue, setInputValue] as const;
}