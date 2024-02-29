import { Form, ButtonGroup, Button } from "react-bootstrap";
import { useFormFieldNew } from "../hooks/useFormFieldNew";
import { Category } from "../types.d";
import classes from "./UploadForm.module.scss";
import DropDown from "./DropDown";
import { categories } from "../types/category";
import { useState } from "react";

type UploadFormProps = {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: Category;

  validateFieldsOnMount?: boolean;
}

const UploadForm = (props: UploadFormProps) => {
  const showInitialValidity = props.validateFieldsOnMount ?? false;

  const [category, setCategory] = useState<Category>("Other");

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

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = formData.get("title");
    const description = formData.get("description");
    const image = formData.get("image");

    console.log("Title", title);
    console.log("Category", category);
    
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

    {/* <Spinner className={`${classes.spinner} ${submitting ? classes.visible : ""}`} variant="primary" animation="border" /> */}

    <ButtonGroup className={classes.buttons}>
      <Button
        disabled={!formIsValid}
        className={classes.btn}
        type="submit"
      >
        Submit
      </Button>

      {/* {props.updating && <Button className={`${classes.btn} btn-danger`} type="button" onClick={() => navigate(`/views?id=${props.id}`)}>Cancel</Button>} */}
    </ButtonGroup>
  </Form>

</div>
}

export default UploadForm;