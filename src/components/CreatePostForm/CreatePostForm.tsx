import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormikHelpers } from "formik";
import toast from "react-hot-toast";

import css from "./CreatePostForm.module.css";
import { PostCreate } from "../../types/post";
import { createPost } from "../../services/postService";

const initialFormValues: PostCreate = {
  body: "",
  title: "",
  userId: 1,
};

const OrderSchema = Yup.object().shape({
  title: Yup.string().min(3, "Too short!").max(50, "Too long!").required("Required"),
  body: Yup.string().max(500, "Too long!"),
});

interface PostFormProps {
  onClose: () => void;
}

export default function PostForm({ onClose }: PostFormProps) {
  const queryClient = useQueryClient();

  const { mutate: postMutation, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success("Creating post successfully!");
    },
    onError() {
      toast.error("Error creating post!");
    },
  });

  const handleSubmit = async (values: PostCreate, formikHelpers: FormikHelpers<PostCreate>) => {
    postMutation(values);
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={OrderSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
