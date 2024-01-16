import { ChangeEvent, Reducer, useReducer } from "react"
import { ActionCreator } from "../types";
import { FormControl, FormControlProps } from "react-bootstrap";

type Action<TFieldValue> = ActionCreator<{
  SET_TOUCHED: boolean;
  SET_IS_VALID: boolean;
  SET_VALUE: TFieldValue;
}>;

type ValidInputElements = {
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
}

type State<TFieldValue> = ReturnType<typeof getInitialState<TFieldValue>>;

function getInitialState<TFieldValue>(initialValue: TFieldValue) {
  return {
    touched: false,
    isValid: false,
    value: initialValue,
  }
}

function formFieldReducer<TFieldValue>(state: State<TFieldValue>, action: Action<TFieldValue>) {
  switch (action.type) {
    case "SET_IS_VALID":
      return { ...state, isValid: action.payload };
    case "SET_TOUCHED":
      return { ...state, touched: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    default:
      return state;
  }
}

// Documentation for hovering over the useFormField hook

/**
 * @param InputElement The component to use for the form field
 * @param inputProps The props to pass to the FormControl component
 * @param initialState Initial state
 * @param selectChangeableValue A function that picks the value from the change event
 * @param checkValidity Checks the validity of the value
 * @returns {[JSX.Element, TFieldValue, boolean, boolean]} An array containing the following elements:
 * - A JSX.Element that represents the form field.
 * - The value of the form field.
 * - A boolean that indicates whether the form field is currently valid.
 * - A boolean that updates with each keystroke to indicate whether the form field is valid after the keystroke.
 */

export function useFormField<TFieldValue, TElementName extends keyof ValidInputElements = "input">(
  InputElement: typeof FormControl,
  inputProps: FormControlProps & { as?: TElementName } & { [key: string]: any },
  initialState: {
    touched: boolean;
    isValid: boolean;
    value: TFieldValue;
  },
  selectChangeableValue: (event: ChangeEvent<ValidInputElements[TElementName]>) => TFieldValue,
  checkValidity: (value: TFieldValue) => boolean,
) {
  const [state, dispatch] = useReducer<Reducer<State<TFieldValue>, Action<TFieldValue>>>(formFieldReducer, initialState);

  const changeHandler = (event: ChangeEvent<ValidInputElements[TElementName]>) => {
    dispatch({
      type: "SET_VALUE",
      payload: selectChangeableValue(event),
    })
  }

  const blurHandler = () => {
    dispatch({
      type: "SET_TOUCHED",
      payload: true,
    });

    dispatch({
      type: "SET_IS_VALID",
      payload: checkValidity(state.value),
    })
  }

  const focusHandler = () => {
    dispatch({
      type: "SET_TOUCHED",
      payload: false,
    });
  }

  const setTouched = (touched: boolean) => {
    dispatch({
      type: "SET_TOUCHED",
      payload: touched,
    });
  }

  const component = <InputElement
    onBlur={blurHandler}
    onFocus={focusHandler}
    onChange={changeHandler}
    isValid={state.isValid && state.touched}
    isInvalid={!state.isValid && state.touched}
    {...inputProps}

    /*
      With this cast, I kind of just gave up trying to satisfy the type checker.
      I ground and ground and ground, but I couldn't get it to work. However, I
      still managed to get the exact behavior I wanted, so ... yeah.
      
      My problem was that the as prop is a key of ValidInputElements, so it
      should be a union of strings. However, the type checker seemed to think
      it wasn't just a union of strings, but that is what it is.

      The as prop on the FormControl Bootstrap component is a union of string
      literals that represent the valid HTML elements that can be used to get
      the type of the element. I used generics so that I wouldn't have a union
      (e.g. HTMLInputElement | HTMLTextAreaElement) and instead just have the
      type of the element that was passed in as the generic parameter:

      T = HTMLInputElement, the type is HTMLInputElement
      T = HTMLTextAreaElement, the type is HTMLTextAreaElement
    */
    as={inputProps.as as keyof ValidInputElements}
  />;

  return [component, checkValidity(state.value), state.value, setTouched] as const;
}