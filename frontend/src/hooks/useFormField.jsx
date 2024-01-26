import { useReducer } from "react"
import { Form } from "react-bootstrap";

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
 * @param InputElement The component to use for the form field
 * @param inputProps The props to pass to the FormControl component
 * @param initialState Initial state
 * @param selectChangeableValue A function that picks the value from the change event
 * @param checkValidity Checks the validity of the value. Return undefined if valid, otherwise return an error message
 * @returns A tuple containing the component, a boolean indicating whether the field is valid, the value, a function to set the touched state, a function to set the valid state, and a function to set the value
*/

export function useFormField(
  InputElement,
  inputProps,
  initialState,
  selectChangeableValue,
  checkValidity,
) {
  const [state, dispatch] = useReducer(formFieldReducer, initialState);

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

  const setTouched = (touched) => {
    dispatch({
      type: "SET_TOUCHED",
      payload: touched,
    });
  }

  const setValid = (isValid) => {
    dispatch({
      type: "SET_IS_VALID",
      payload: isValid,
    });
  }

  const setValue = (value) => {
    dispatch({
      type: "SET_VALUE",
      payload: value,
    });
  }

  const component = <>
    <InputElement
      onBlur={blurHandler}
      onFocus={focusHandler}
      onChange={changeHandler}
      isValid={state.isValid && state.touched}
      isInvalid={!state.isValid && state.touched}
      defaultValue={typeof state.value === "string" || typeof state.value === "number" ? state.value : undefined}
      {...inputProps}

      as={inputProps.as}
    />
    <Form.Label style={{
      visibility: state.touched && !state.isValid ? "visible" : "hidden",
    }} className="text-danger">{state.errorMessage ?? "valid"}</Form.Label>
  </>;


  return [component, !checkValidity(state.value), state.value, setTouched, setValid, setValue];
}