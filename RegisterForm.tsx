import "./assets/forms.scss";

import { stringifyQuery } from "@getpack/core";
import { SocialDetailsType } from "@getpack/core-api";
import { AppForm } from "@getpack/core-components";
import { I18nContextConsumer } from "@getpack/core-locales";
import { memoize } from "lodash-es";
import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";

import { TextFormField } from "../form/TextFormField";
import { BubbleHelpButton } from "../ui/BubbleHelpButton";
import { InputTypes } from "../ui/TextField";
import { FacebookLoginWidget } from "./FacebookLoginWidget";
import { TelegramLoginButton } from "./TelegramLoginWidget";

export interface RegisterFormValues {
  number: string;
  email?: string;
  aviaId?: string;
  fullName: string;
}

type RegisterFormErrors = {
  [P in keyof RegisterFormValues]?: null | string | boolean
};

interface Props {
  submitError?: Error;
  initialValues?: Partial<RegisterFormValues>;

  submitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

const validateForm = memoize(ctx => (values: RegisterFormValues) => {
  const errors: RegisterFormErrors = {};

  if (!values.number) {
    errors.number = ctx.RegisterFormValidMobileNumber;
  }

  if (!values.fullName) {
    errors.fullName = ctx.RegisterFormValidFullName;
  }

  return errors;
});

export function RegisterForm(props: Props) {
  const { submitting } = props;

  return (
    <I18nContextConsumer>
      {ctx => (
        <AppForm
          onSubmit={props.onSubmit}
          validate={validateForm(ctx)}
          subscription={{ values: true }}
          initialValues={props.initialValues}
          render={({ values, handleSubmit, form }) => (
            <form
              className="d-flex flex-column auth-form"
              onSubmit={handleSubmit}
            >
              <div className="social-login-buttons">
                <FacebookLoginWidget
                  onAuth={user => {
                    form.batch(() => {
                      form.change("stype", SocialDetailsType.Facebook);
                      form.change("sid", user.accessToken);
                      form.change("fullName", user.fullName);
                    });
                  }}
                />
                <TelegramLoginButton
                  onAuth={user => {
                    form.batch(() => {
                      form.change("stype", SocialDetailsType.Telegram);
                      form.change("sid", user.id);
                      form.change(
                        "fullName",
                        [user.firstName, user.lastName]
                          .filter(Boolean)
                          .join(" ") || user.username,
                      );
                    });
                  }}
                />
              </div>

              <TextFormField
                name="fullName"
                required={true}
                className="mb-3"
                disabled={submitting}
                label={ctx.RegisterFormFullName}
              />

              <TextFormField
                name="number"
                required={true}
                className="mb-3"
                disabled={submitting}
                label={ctx.GenericMobileNumber}
              />

              <TextFormField
                name="email"
                className="mb-3"
                disabled={submitting}
                type={InputTypes.Email}
                rightComponent={
                  <BubbleHelpButton
                    className="pb-2 pl-2 pr-0"
                    text={ctx.RegisterFormEmailHelp}
                  />
                }
                label={ctx.RegisterFormEmailOptional}
              />

              <TextFormField
                name="aviaId"
                className="mb-1"
                disabled={submitting}
                rightComponent={
                  <BubbleHelpButton
                    className="pb-2 pl-2 pr-0"
                    text={ctx.RegisterFormAviaHelp}
                  />
                }
                label={ctx.RegisterFormAviaOptional}
              />
              <br />
              <div className="mb-3 required-fields-text">
                <span className="text-danger">*</span>{" "}
                {ctx.RegisterFormRequiredFields}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-secondary mb-5 text-uppercase"
              >
                {ctx.GenericContinue}
              </button>

              <span className="help-content">
                <span className="agreement-text">
                  {ctx.RegisterFormYouAgree}
                  <br />
                  <Link to="/terms-of-service" className="terms-of-use-link ">
                    {ctx.RegisterFormTermsOfService}
                  </Link>
                </span>
                <span className="help-text">
                  {ctx.GenericAlreadyHaveAnAccount}
                </span>{" "}
                <Route
                  render={({ location }) => (
                    <Link
                      to={{
                        ...location,

                        hash: "sign-in",
                        search: stringifyQuery({ phone: values.number }),
                      }}
                      className="help-link"
                    >
                      {ctx.SignIn}
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
