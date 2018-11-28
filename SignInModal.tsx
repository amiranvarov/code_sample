import "./assets/modals.scss";

import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import { LoginForm, LoginFormValues } from "./LoginForm";

interface Props {
  open: boolean;
  onRequestClose: () => void;

  initialValues: Partial<LoginFormValues>;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: LoginFormValues) => void;
}

export function SignInModal(props: Props) {
  return (
    <Dialog
      open={props.open}
      title={<AuthModalTitle title={<I18nText code="SignIn" />} />}
      className="modal-authorization"
      bodyClassName="modal-authorization-body"
      onRequestClose={props.onRequestClose}
    >
      <LoginForm
        onSubmit={props.onSubmit}
        submitting={props.submitting}
        submitError={props.submitError}
        initialValues={props.initialValues}
      />
    </Dialog>
  );
}
