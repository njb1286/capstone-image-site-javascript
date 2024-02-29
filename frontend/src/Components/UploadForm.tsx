import { Form, ButtonGroup, Button, Spinner } from "react-bootstrap";
import { useFormFieldNew } from "../hooks/useFormFieldNew";
import { Category } from "../types.d";
import classes from "./UploadForm.module.scss";
import DropDown from "./DropDown";
import { categories } from "../types/category";
import { useState } from "react";

export type UploadFormProps = {
  onSubmit?: (formData: FormData) => Promise<boolean | void>;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: Category;

  validateFieldsOnMount?: boolean;
}

const UploadForm = (props: UploadFormProps) => {
  const showInitialValidity = props.validateFieldsOnMount ?? false;

  const [category, setCategory] = useState<Category>(props.defaultCategory ?? "Other");
  const [image, setImage] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [titleComponent, titleIsValid] = useFormFieldNew(
    "Title",
    "value",
    (currentValue) => {
      if (!currentValue) {
        return "Title is required";
      }
    },
    props.defaultTitle ?? "",
    {
      props: {
        name: "title",
      },
      elementType: "input",
      showInitialValidity,
    }
  );

  const [imageComponent, imageIsValid] = useFormFieldNew(
    "Image",
    "files",
    (currentValue) => {
      if (!currentValue || currentValue.length === 0) {
        return "Image is required"
      }
    },
    null,
    {
      props: {
        type: "file",
        accepts: "image/png, image/jpeg, image/jpg"
      },
      elementType: "input",
      showInitialValidity,
      onChange: (event) => {
        const files = event.target.files!;
        const file = files[0];
        setImage(file);
      }
    }
  )

  const [descriptionComponent, descriptionIsValid] = useFormFieldNew(
    "Description",
    "value",
    (currentValue) => {
      if (!currentValue) {
        return "Description is required";
      }
    },
    props.defaultDescription ?? "",
    {
      props: {
        name: "description",
      },
      elementType: "textarea",
      showInitialValidity,
    }
  )

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formData.append("category", category);
    formData.append("image", image!);

    try {
      const result = await props.onSubmit?.(formData);

      // If the onSubmit returns true, it means that an error occurred
      if (result === true) {
        setIsError(true);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setIsError(false);
    } catch {
      setSubmitting(false);
      setIsError(true);
    }
    
  }

  const categorySelectHandler = (category: Category) => {
    setCategory(category);
  }

  const formIsValid = titleIsValid && imageIsValid && descriptionIsValid;

  return <div className={classes["upload-form"]}>
  <Form onSubmit={submitHandler}>
    <div className={classes["form-items"]}>
      {titleComponent}
      {imageComponent}
      {descriptionComponent}
      <DropDown onSelect={categorySelectHandler} categories={categories} defaultValue="Other" />

      {/* <FormGroup>
        <Form.Label>Image</Form.Label>
        {imageComponent}
      </FormGroup>

      <FormGroup>
        <Form.Label>Description</Form.Label>
        {descriptionComponent}
      </FormGroup>

      <FormGroup>
        <Form.Label>Category</Form.Label>
        <DropDown className={classes.dropdown} onSelect={setCategory} categories={categories} default={category} />
      </FormGroup> */}
    </div>

    <Spinner className={`${classes.spinner} ${submitting ? classes.visible : ""}`} variant="primary" animation="border" />

    <ButtonGroup className={classes.buttons}>
      <Button
        disabled={!formIsValid}
        className={classes.btn}
        type="submit"
      >
        Submit
      </Button>

      {isError && <p className="text text-danger">An error occurred!</p>}
      {/* {props.updating && <Button className={`${classes.btn} btn-danger`} type="button" onClick={() => navigate(`/views?id=${props.id}`)}>Cancel</Button>} */}
    </ButtonGroup>
  </Form>

</div>
}

export default UploadForm;