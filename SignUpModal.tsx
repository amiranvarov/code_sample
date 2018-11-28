import "./assets/modals.scss";

import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import { RegisterForm, RegisterFormValues } from "./RegisterForm";

interface Props {
  open: boolean;
  onRequestClose: () => void;

  initialValues: Partial<RegisterFormValues>;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export function SignUpModal(props: Props) {
  return (
    <Dialog
      open={props.open}
      className="modal-authorization"
      onRequestClose={props.onRequestClose}
      bodyClassName="modal-authorization-body"
      title={<AuthModalTitle title={<I18nText code="SignUp" />} />}
    >
      <RegisterForm
        submitting={props.submitting}
        submitError={props.submitError}
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}
      />
    </Dialog>
  );
}
