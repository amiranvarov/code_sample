import "./assets/forms.scss";

import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";

import { TextFormField } from "../form/TextFormField";
import { InputTypes } from "../ui/TextField";

export interface RegisterCompleteFormValues {
  password: string;
  passwordConfirm: string;
}

type RegisterCompleteFormErrors = {
  [P in keyof RegisterCompleteFormValues]?: null | string | boolean
};

interface Props {
  submitError?: Error;
  initialValues?: Partial<RegisterCompleteFormValues>;

  submitting: boolean;
  onSubmit: (values: RegisterCompleteFormValues) => void;
}

const validateForm = memoize(ctx => (values: RegisterCompleteFormValues) => {
  const errors: RegisterCompleteFormErrors = {};

  if (!values.password) {
    errors.password = ctx.RegisterCompleteFormValidPassword;
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = ctx.RegisterCompleteFormValidConfirmPassword;
  }

  return errors;
});

export function RegisterCompleteForm(props: Props) {
  const { submitting } = props;

  return (
    <I18nContextConsumer>
      {ctx => (
        <AppForm
          onSubmit={props.onSubmit}
          validate={validateForm(ctx)}
          initialValues={props.initialValues}
          render={({ handleSubmit }) => (
            <form
              className="d-flex flex-column auth-form"
              onSubmit={handleSubmit}
            >
              <TextFormField
                name="password"
                className="mb-3"
                disabled={submitting}
                type={InputTypes.Password}
                label={ctx.RegisterCompleteFormEnterNewPassword}
              />

              <TextFormField
                name="passwordConfirm"
                className="mb-3"
                disabled={submitting}
                type={InputTypes.Password}
                label={ctx.RegisterCompleteFormConfirmPassword}
              />

              <span className="help-content mb-4">
                <span className="help-text">
                  {ctx.RegisterCompleteFormByClicking}
                </span>

                <br />

                <a href="/" className="help-link">
                  {ctx.RegisterCompleteFormGetpackTerms}
                </a>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary text-uppercase"
              >
                {ctx.GenericCreateAccount}
              </button>
            </form>
          )}
        />
      )}
    </I18nContextConsumer>
  );
}
