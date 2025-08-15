import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormikHelpers } from "formik";
import toast from "react-hot-toast";

import css from "./EditPostForm.module.css";
import { Post } from "../../types/post";
import { editPost } from "../../services/postService";

const OrderSchema = Yup.object().shape({
  title: Yup.string().min(3, "Too short!").max(50, "Too long!").required("Required"),
  body: Yup.string().max(500, "Too long!"),
});

interface EditFormProps {
  onClose: () => void;
  currentPost: Post;
}

export default function EditPostForm({ onClose, currentPost }: EditFormProps) {
  const queryClient = useQueryClient();

  const { mutate: editMutation, isPending } = useMutation({
    mutationFn: editPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success("Editing post successfully!");
    },
    onError() {
      toast.error("Error editing post!");
    },
  });

  const handleSubmit = async (values: Post, formikHelpers: FormikHelpers<Post>) => {
    editMutation(values);
    formikHelpers.resetForm();
  };

  return (
    <Formik initialValues={currentPost} validationSchema={OrderSchema} onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
