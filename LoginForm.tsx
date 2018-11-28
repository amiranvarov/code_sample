import "./assets/forms.scss";

import { stringifyQuery } from "@getpack/core";
import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";
import { Link, Route } from "react-router-dom";

import { TextFormField } from "../form/TextFormField";
import { InputTypes } from "../ui/TextField";

export interface LoginFormValues {
  username: string;
  password: string;
}

type LoginFormErrors = {
  [P in keyof LoginFormValues]?: null | string | boolean
};

interface Props {
  submitError?: Error;
  initialValues?: Partial<LoginFormValues>;

  submitting: boolean;
  onSubmit: (values: LoginFormValues) => void;

  onRequestClose?: () => void;
}

const validateForm = memoize(ctx => (values: LoginFormValues) => {
  const errors: LoginFormErrors = {};

  if (!values.username) {
    errors.username = ctx.LoginFormValidMobile;
  }

  if (!values.password) {
    errors.password = ctx.LoginFormValidPassword;
  }

  return errors;
});

export function LoginForm(props: Props) {
  const { submitting } = props;

  return (
    <I18nContextConsumer>
      {ctx => (
        <AppForm
          onSubmit={props.onSubmit}
          validate={validateForm(ctx)}
          keepDirtyOnReinitialize={true}
          subscription={{ values: true }}
          initialValues={props.initialValues}
          render={({ values, handleSubmit }) => (
            <form
              className="d-flex flex-column auth-form"
              onSubmit={handleSubmit}
            >
              <TextFormField
                name="username"
                className="mb-3"
                disabled={submitting}
                label={ctx.GenericMobileNumber}
              />
              <TextFormField
                name="password"
                className="mb-3"
                disabled={submitting}
                type={InputTypes.Password}
                label={ctx.GenericNewPassword}
              />

              <div className="mb-2">
                <Route
                  render={({ location }) => (
                    <Link
                      to={{
                        ...location,

                        hash: "forgot-password",
                        search: stringifyQuery({ phone: values.username }),
                      }}
                      className="forgot-password"
                    >
                      {ctx.LoginFormForgotPassword}
                    </Link>
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary mb-5"
              >
                {ctx.SignIn}
              </button>

              <span className="help-content">
                <span className="help-text">
                  {ctx.GenericDontHaveAnAccount}
                </span>{" "}
                <Route
                  render={({ location }) => (
                    <Link
                      to={{
                        ...location,

                        hash: "sign-up",
                      }}
                      className="help-link"
                    >
                      {ctx.GenericCreateAccount}
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
