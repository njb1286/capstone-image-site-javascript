import { ChangeEvent, ElementType, FocusEvent, useEffect, useRef, useState } from "react";
import { Form, FormControl, FormControlProps, FormGroup } from "react-bootstrap";

type ErrorMessage = string | null | undefined;

/**
 * @param title The label of the input
 * 
 * @param elementPropToUseAsValue The element property that is on the element, that gets used as the value. For example,
 * if this gets passed in as "value", it will get the "InputElement.value" prop. If it
 * gets passed in as "files", it gets the "InputElement.files" prop. Very important: this
 * value must be a prop on the element that gets defined above (in the @var elementType),
 * which is either an input element, or a textarea element.
 * 
 * @param isValidCallback A callback function that takes in the value on the element (which is chosen by the user
 * via the @var elementPropToUseAsValue argument), and uses the return type to determine
 * if the input is valid or not. If it returns a string, then the input field is invalid and
 * the string is used as the error message. If the value is undefined or null, then the
 * input field is valid.
 * 
 * @param defaultValue The default value of this field. The reason I don't put this in the optional options object
 * is because of an issue related to an "uncontrolled input" warning that React gives. The 
 * warning is given because when a state type starts out as undefined, and then gets set to another
 * value, React thinks the state is uncontrolled.
 * 
 * @param options All the optional data for the hook that has the following properties:
 * - elementType: The element type (as a string, must be "input" or "textarea")
 * 
 * - showInitialValidity: If true, the input will show the error message if it is invalid on initial render.
 * You can set the default value of the input by passing in the "defaultValue" prop in
 * the @var componentProps object defined above.
 * 
 * - className: The class name of the Bootstrap FormGroup that surrounds the input and labels
 * 
 * - props: The props that get used for the FormControl component (constrained to what you can pass in to the 
 * FormControl component) The reason I put the props in the optional options is to keep the arguments lean.
 * 
 * - onChange: A callback function that gets called when the input changes.
 * 
 * @returns A tuple with the following properties:
 * - The first element is the component to render
 * - The second element is a boolean that determines if the input is valid or not
 * - The third element is a function that sets the input value
 */
export function useFormField<T extends "input" | "textarea", U extends keyof HTMLElementTagNameMap[T]>(
  title: string,

  elementPropToUseAsValue: U,

  isValidCallback: (value: HTMLElementTagNameMap[T][U]) => ErrorMessage,

  defaultValue: HTMLElementTagNameMap[T][U],

  options: {
    elementType: T,

    showInitialValidity?: boolean,

    className?: string,

    props?: FormControlProps | Record<string, any>,

    onChange?: (event: ChangeEvent<HTMLElementTagNameMap[T]>) => void,
  } = {
      // Default options
      elementType: "input" as T,
      showInitialValidity: false,
      className: undefined as string | undefined,
      props: {},
    },
) {
  /**
   * The HTML Element type that gets assigned based on the @var elementType provided
   * by the user of this hook. It can either be an input or textarea element. That
   * means this type gets assigned to either HTMLInputElement or HTMLTextAreaElement.
   */
  type InputElementType = HTMLElementTagNameMap[T];
  /**
   * The type that gets used for the value provided by the user of this hook.
   * The input element can either be an input or textarea element, and this
   * type uses a selector in the form of a string to access a prop on the element.
   * example:
   * case -> element type = input and element prop to use = "value":
   *  type = the type of inputElement.value, which is a string
   */
  type InputValueType = InputElementType[U];

  /**
   * Set the initial state of the input, because it uses the truthy value of the errorMessage to
   * determine if it is valid or not. This makes the default value for the returned @var isValid
   * false so that the form is initially invalid.
   */
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("invalid");
  const [isTouched, setIsTouched] = useState(false);
  const [inputValue, setInputValue] = useState<InputValueType>(defaultValue);
  const fieldElementRef = useRef<InputElementType>(null);

  /**
   * Runs on initial render. If the showInitialValidity is true, it will set the isTouched to true and
   * set the errorMessage to the result of the isValidCallback that gets passed in. Because it sets
   * "isTouched" to true, the input will show the error message if it is invalid.
   */
  useEffect(() => {
    if (options.showInitialValidity) {
      setIsTouched(true);

      const value = fieldElementRef.current![elementPropToUseAsValue];
      setErrorMessage(isValidCallback(value));
    }
  }, []);

  const changeHandler = (event: ChangeEvent<InputElementType>) => {
    // Get the prop that was passed in by the user
    const value = event.target[elementPropToUseAsValue];

    setErrorMessage(isValidCallback(value));

    setInputValue(value);

    options.onChange?.(event);
  }

  const focusHandler = () => {
    setIsTouched(false);
  }

  const blurHandler = (event: FocusEvent<InputElementType>) => {
    setIsTouched(true);

    // Get the prop that was passed in by the user, and check using it as context
    const value = event.target[elementPropToUseAsValue];
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

  /**
   * This is equivalent to a dynamically selected prop on a component:
   * <MyComponent [propToSelect]={*value} />
   */
  const propToSelect = {
    [elementPropToUseAsValue]: inputValue,
  }

  const component = (
    <FormGroup className={options.className}>
      <Form.Label>{title}</Form.Label>
      <FormControl
        /** Each prop passed in to the props in the options */
        {...options.props}

        /** The "as" prop takes in a string that represents an HTML element, and renders as that element */
        as={options.elementType as ElementType}
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}

        // Bootstrap's fancy validity styling (adds a green border if valid, and a red border if invalid)
        isValid={isTouched && isValid}
        isInvalid={isTouched && !isValid}

        /**
         * The value prop is a single-key object that has the same key as the @var elementPropToUseAsValue
         * passed in by the user. The reason for this is so we can get a dynamic prop value from the field
         * element. For example, if we assume that the input element is an object with the props being keys:
         * 
         * InputElement = {
         *  value: *string value*,
         *  onClick: *Function value for on click event*,
         *  [elementPropToUseAsValue]: *Default value passed in by the user (@var defaultValue)*
         * }
         * 
         * This allows us to dynamically set a prop selected by the user on the input element.
         */
        {...propToSelect}

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

  /**
   * @var component - The component to use
   * @var isValid - (updated on each key stroke) Whether the input is valid or not
   * @var setInputValue - A setState function that sets the input value
   * 
   * The reason I don't include the @var inputValue in the return statement is to
   * keep this hook lean. You can just use the values from the form in the submit
   * event handler using the default HTML form data that gets passed in.
   */
  return [component, isValid, setInputValue] as const;
}