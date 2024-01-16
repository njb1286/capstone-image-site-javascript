import { ChangeEvent, ComponentProps, Reducer, useReducer } from "react"
import { ActionCreator } from "../types";
import { FormControl } from "react-bootstrap";

type Action<TFieldValue> = ActionCreator<{
  SET_TOUCHED: boolean;
  SET_IS_VALID: boolean;
  SET_VALUE: TFieldValue;
}>;

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

// Exclude unnecessary props from the FormControl component
type FieldInputProps = Omit<Omit<Omit<ComponentProps<"input">, "ref">, "value">, "size">;

// Documentation for hovering over the useFormField hook

/**
 * 
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

export function useFormField<TFieldValue>(
  inputProps: FieldInputProps,
  initialState: {
    touched: boolean;
    isValid: boolean;
    value: TFieldValue;
  },
  selectChangeableValue: (event: ChangeEvent<HTMLInputElement>) => TFieldValue,
  checkValidity: (value: TFieldValue) => boolean,
) {
  const [state, dispatch] = useReducer<Reducer<State<TFieldValue>, Action<TFieldValue>>>(formFieldReducer, initialState);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
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

  const component = <FormControl
    {...inputProps}
    onBlur={blurHandler}
    onFocus={focusHandler}
    onChange={changeHandler}
    isValid={state.isValid && state.touched}
    isInvalid={!state.isValid && state.touched}
  />;

  return [component, state.value, state.isValid && state.touched, checkValidity(state.value)] as const;
}