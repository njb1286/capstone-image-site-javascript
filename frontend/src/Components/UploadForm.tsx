import { Form, ButtonGroup, Button, Spinner } from "react-bootstrap";
import { useFormField } from "../hooks/useFormField";
import { Category } from "../types.d";
import classes from "./UploadForm.module.scss";
import DropDown from "./DropDown";
import { useState } from "react";
import { categories } from "../store/images-store";

export type UploadFormProps = {
  onSubmit?: (formData: FormData) => Promise<boolean | void>;
  onCancel?: () => void;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: Category;

  validateFieldsOnMount?: boolean;
  shouldNotValidateImage?: boolean;
}

const UploadForm = (props: UploadFormProps) => {
  const showInitialValidity = props.validateFieldsOnMount ?? false;

  const [category, setCategory] = useState<Category>(props.defaultCategory ?? "Other");  
  
  const [image, setImage] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [titleComponent, titleIsValid] = useFormField(
    "Title",
    "value",
    (currentValue) => {
      if (!currentValue) {
        return "Title is required";
      }

      if (currentValue.length >= 128) {
        return "Title must be less than 129 characters";
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

  const [imageComponent, imageIsValid] = useFormField(
    "Image",
    "files",
    (currentValue) => {
      if (props.shouldNotValidateImage) return;
      if (!currentValue || currentValue.length === 0) {
        return "Image is required"
      }

      const validImages = ["png", "jpeg", "jpg"];
      const fileEnd = currentValue[0].name.split(".").pop()!.toLowerCase();

      if (!validImages.includes(fileEnd)) {
        return "Image must be a .png, .jpeg, or .jpg file"
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

  const [descriptionComponent, descriptionIsValid] = useFormField(
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
        style: {
          height: "25rem"
        }
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
      <DropDown onSelect={categorySelectHandler} categories={categories} defaultValue={category} />
    </div>

    <Spinner className={`${classes.spinner} ${submitting ? classes.visible : ""}`} variant="primary" animation="border" />

    <ButtonGroup className={classes.buttons}>
      <Button
        disabled={!formIsValid && !submitting}
        className={classes.btn}
        type="submit"
      >
        Submit
      </Button>

      {props.onCancel && <Button className={`btn btn-danger ${classes.btn}`} type="button" onClick={props.onCancel}>Cancel</Button>}

      {isError && <p className="text text-danger">An error occurred!</p>}
    </ButtonGroup>
  </Form>

</div>
}

export default UploadForm;