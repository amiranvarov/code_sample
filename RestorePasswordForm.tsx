import "./assets/forms.scss";

import { stringifyQuery } from "@getpack/core";
import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";

import { TextFormField } from "../form/TextFormField";
import { InputTypes } from "../ui/TextField";

export interface RestorePasswordFormValues {
  code: string;
  password: string;
  confirmPassword?: string;
}

type RestorePasswordFormErrors = {
  [P in keyof RestorePasswordFormValues]?: null | string | boolean
};

interface Props {
  phone: string;

  submitError?: Error;
  initialValues?: Partial<RestorePasswordFormValues>;

  onResendClick: () => void;

  submitting: boolean;
  onSubmit: (values: RestorePasswordFormValues) => void;
}

const validateForm = memoize(ctx => (values: RestorePasswordFormValues) => {
  const errors: RestorePasswordFormErrors = {};

  if (!values.code) {
    errors.code = ctx.RegisterVerificationFormValidCode;
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = ctx.RegisterCompleteFormValidConfirmPassword;
  }

  return errors;
});

export function RestorePasswordForm(props: Props) {
  const { submitting } = props;

  return (
    <I18nContextConsumer>
      {ctx => (
        <AppForm
          onSubmit={props.onSubmit}
          validate={validateForm(ctx)}
          keepDirtyOnReinitialize={true}
          render={({ handleSubmit }) => (
            <form
              className="d-flex flex-column auth-form"
              onSubmit={handleSubmit}
            >
              <span className="info-content">
                <span>{ctx.RegisterVerificationFormEnterTheCode}</span>
                <span className="info-number">{props.phone}</span>
              </span>

              <TextFormField
                name="code"
                className="mb-3"
                disabled={submitting}
                label={ctx.RegisterVerificationFormVerificationCode}
              />

              <TextFormField
                name="password"
                className="mb-3"
                disabled={submitting}
                type={InputTypes.Password}
                label={ctx.RegisterCompleteFormEnterNewPassword}
              />

              <TextFormField
                className="mb-3"
                disabled={submitting}
                name="confirmPassword"
                type={InputTypes.Password}
                label={ctx.RegisterCompleteFormConfirmPassword}
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary mb-5 text-uppercase"
              >
                {ctx.GenericContinue}
              </button>

              <span className="help-content text-sm-left">
                <div className="d-flex flex-column flex-sm-row align-items-center">
                  <span className="help-text">
                    {ctx.RegisterVerificationFormDidNotSms}
                  </span>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={props.onResendClick}
                    className="btn btn-sm btn-link help-link"
                  >
                    {ctx.RegisterVerificationFormResend}
                  </button>
                </div>

                <Route
                  render={({ location }) => (
                    <Link
                      to={{
                        ...location,

                        hash: "forgot-password",
                        search: stringifyQuery({
                          reset: true,
                          phone: props.phone,
                        }),
                      }}
                      className="help-link"
                    >
                      {ctx.RegisterVerificationFormUpdateMobileNumber}
                    </Link>
                  )}
                />
              </span>
            </form>
          )}
        />
      )}
    </I18nContextConsumer>
  );
}
