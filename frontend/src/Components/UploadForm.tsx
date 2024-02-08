import { Form, FormGroup, Spinner, ButtonGroup, Button } from "react-bootstrap";
import { useFormFieldNew } from "../hooks/useFormFieldNew";
import { Category, categories } from "../types.d";
import classes from "./UploadForm.module.scss";
import { useSelector } from "react-redux";
import { useState } from "react";

type UploadFormProps = {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: Category;

  validateFieldsOnMount?: boolean;
}

const UploadForm = (props: UploadFormProps) => {
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
      elementType: "input"
    }
  );

  const [imageComponent, imageIsValid] = useFormFieldNew(
    "Image",
    "files",
    (currentValue) => {
      if (!currentValue) {
        return "Image is required"
      }
    },
    null,
    {
      elementType: "input"
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
    }
  )

  const [sampleComponent, isSampleValid, setSampleValue] = useFormFieldNew(
    "Some field",
    "value",
    (currentValue) => {
      if (currentValue.length < 5) {
        return "Must be at least 5 characters long"
      }
    },
    "",
    {
      props: {
        name: "sample"
      },
      elementType: "input",
    }
  )

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");
    const sample = formData.get("sample");


    console.log("Title", title);
    console.log("Sample", sample);
  }

  return <div className={classes["upload-form"]}>
  <Form onSubmit={submitHandler}>
    <div className={classes["form-items"]}>
      {titleComponent}
      {descriptionComponent}
      {sampleComponent}

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
        // disabled={
        //   !titleValid ||
        //   !descriptionValid ||
        //   !imageValid ||
        //   submitting
        // }
        
        className={classes.btn}
        type="submit"
      >
        Submit
      </Button>

      <Button onClick={() => {
      }}>
        Clear fields
      </Button>

      {/* {props.updating && <Button className={`${classes.btn} btn-danger`} type="button" onClick={() => navigate(`/views?id=${props.id}`)}>Cancel</Button>} */}
    </ButtonGroup>
  </Form>

  {/* {isError && errorMessage} */}
</div>
}

export default UploadForm;