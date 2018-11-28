import "./assets/forms.scss";

import { stringifyQuery } from "@getpack/core";
import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";

import { TextFormField } from "../form/TextFormField";

export interface RegisterVerifyFormValues {
  smsCode: string;
}

type RegisterVerifyFormErrors = {
  [P in keyof RegisterVerifyFormValues]?: null | string | boolean
};

interface Props {
  phone: string;

  submitError?: Error;
  initialValues?: Partial<RegisterVerifyFormValues>;

  onResendClick: () => void;

  submitting: boolean;
  onSubmit: (values: RegisterVerifyFormValues) => void;
}

const validateForm = memoize(ctx => (values: RegisterVerifyFormValues) => {
  const errors: RegisterVerifyFormErrors = {};

  if (!values.smsCode) {
    errors.smsCode = ctx.RegisterVerificationFormValidCode;
  }

  return errors;
});

export function RegisterVerifyForm(props: Props) {
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
              <span className="text-primary text-center mb-4">
                <span className="d-block mb-1">
                  {ctx.RegisterVerificationFormEnterTheCode}
                </span>
                <span className="font-weight-bold">{props.phone}</span>
              </span>

              <TextFormField
                name="smsCode"
                className="mb-3"
                disabled={submitting}
                label={ctx.RegisterVerificationFormVerificationCode}
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary mb-5 text-uppercase"
              >
                {ctx.GenericContinue}
              </button>

              <span className="help-content text-sm-left">
                <div className="d-flex align-items-center">
                  <span className="help-text">
                    {ctx.RegisterVerificationFormDidNotSms}?
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

                        hash: "sign-up",
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
