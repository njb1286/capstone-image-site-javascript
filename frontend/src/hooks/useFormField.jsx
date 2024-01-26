import { ChangeEvent, useReducer } from "react"
import { Form, FormControl, FormControlProps } from "react-bootstrap";

/**
  * @template TFieldValue
   * @typedef {ActionCreator<{
   *    SET_TOUCHED: boolean;
   *    SET_IS_VALID: boolean;
   *    SET_VALUE: TFieldValue;
   *    SET_ERROR_MESSAGE: string | undefined;
   * }>} Action
*/

/**
 * @typedef {{
 *    input: HTMLInputElement;
 *    textarea: HTMLTextAreaElement;
 *  }} ValidInputElements
 */

/**
 * @template TFieldValue
 * @typedef {{
 *  touched: boolean;
 *  isValid: boolean;  
 *  value: TFieldValue;
 *  errorMessage: string | undefined;
 * }} State
 */

/**
 * @template TFieldValue
 * @param {State<TFieldValue>} state 
 * @param {Action<TFieldValue>} action 
 * @returns 
 */

function formFieldReducer(state, action) {
  switch (action.type) {
    case "SET_IS_VALID":
      return { ...state, isValid: action.payload };
    case "SET_TOUCHED":
      return { ...state, touched: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
}

// Documentation for hovering over the useFormField hook

/**
 * @typedef {{
 *   touched: boolean;
 *   isValid: boolean;
 *   value: TFieldValue;
 *   errorMessage: string | undefined;
 * }} InitialState
 */

/**
 * @typedef {ChangeEvent<ValidInputElements[TElementName]>} OnChangeEvent
 */

/**
 * @template TFieldValue
 * @template TElementName
 * 
 * @param {typeof FormControl} InputElement The component to use for the form field
 * @param {FormControlProps & { as?: TElementName } & { [key: string]: any }} inputProps The props to pass to the FormControl component
 * @param {InitialState} initialState Initial state
 * @param {(event: OnChangeEvent) => TFieldValue} selectChangeableValue A function that picks the value from the change event
 * @param {(value: TFieldValue) => string | undefined} checkValidity Checks the validity of the value. Return undefined if valid, otherwise return an error message
 * @returns {[JSX.Element, boolean, TFieldValue, (touched: boolean) => void, (isValid: boolean) => void, (value: TFieldValue) => void]} A tuple containing the component, a boolean indicating whether the field is valid, the value, a function to set the touched state, a function to set the valid state, and a function to set the value
*/

export function useFormField(
  InputElement,
  inputProps,
  initialState,
  selectChangeableValue,
  checkValidity
) {
  const [state, dispatch] = useReducer(formFieldReducer, initialState);

  /** @param {OnChangeEvent} event */
  const changeHandler = (event) => {
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

    const errorMessage = checkValidity(state.value);

    dispatch({
      type: "SET_IS_VALID",
      payload: !errorMessage,
    });

    if (typeof errorMessage !== typeof state.errorMessage && errorMessage !== state.errorMessage) {
      dispatch({
        type: "SET_ERROR_MESSAGE",
        payload: errorMessage,
      });
    }
  }

  const focusHandler = () => {
    dispatch({
      type: "SET_TOUCHED",
      payload: false,
    });
  }

  /** @param {boolean} touched */
  const setTouched = (touched) => {
    dispatch({
      type: "SET_TOUCHED",
      payload: touched,
    });
  }

  /** @param {boolean} isValid */
  const setValid = (isValid) => {
    dispatch({
      type: "SET_IS_VALID",
      payload: isValid,
    });
  }

  /** @param {TFieldValue} value */
  const setValue = (value) => {
    dispatch({
      type: "SET_VALUE",
      payload: value,
    });
  }

  /**
   * @type {keyof ValidInputElements}
   */
  const asProp = inputProps.as;

  const component = <>
    <InputElement
      onBlur={blurHandler}
      onFocus={focusHandler}
      onChange={changeHandler}
      isValid={state.isValid && state.touched}
      isInvalid={!state.isValid && state.touched}
      defaultValue={typeof state.value === "string" || typeof state.value === "number" ? state.value : undefined}
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
      as={asProp}
    />
    <Form.Label style={{
      visibility: state.touched && !state.isValid ? "visible" : "hidden",
    }} className="text-danger">{state.errorMessage ?? "valid"}</Form.Label>
  </>;


  return [component, !checkValidity(state.value), state.value, setTouched, setValid, setValue];
}