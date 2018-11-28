import "./assets/forms.scss";

import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";

import { TextFormField } from "../form/TextFormField";

export interface ForgotPasswordFormValues {
  number: string;
}

type RegisterFormErrors = {
  [P in keyof ForgotPasswordFormValues]?: null | string | boolean
};

interface Props {
  submitError?: Error;
  initialValues?: Partial<ForgotPasswordFormValues>;

  submitting: boolean;
  onSubmit: (values: ForgotPasswordFormValues) => void;
}

const validateForm = memoize(ctx => (values: ForgotPasswordFormValues) => {
  const errors: RegisterFormErrors = {};

  if (!values.number) {
    errors.number = ctx.RegisterFormValidMobileNumber;
  }

  return errors;
});

export function ForgotPasswordForm(props: Props) {
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
                name="number"
                className="mb-3"
                disabled={submitting}
                label={ctx.GenericMobileNumber}
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary mb-5 text-uppercase"
              >
                {ctx.GenericContinue}
              </button>
            </form>
          )}
        />
      )}
    </I18nContextConsumer>
  );
}
