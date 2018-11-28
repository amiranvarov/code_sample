import "./assets/modals.scss";

import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import {
  ForgotPasswordForm,
  ForgotPasswordFormValues,
} from "./ForgotPasswordForm";

interface Props {
  open: boolean;
  onRequestClose: () => void;

  initialValues: Partial<ForgotPasswordFormValues>;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: ForgotPasswordFormValues) => void;
}

export function ForgotPasswordModal(props: Props) {
  return (
    <Dialog
      className="modal-authorization"
      bodyClassName="modal-authorization-body"
      open={props.open}
      title={
        <AuthModalTitle title={<I18nText code="ForgotPasswordFormTitle" />} />
      }
      onRequestClose={props.onRequestClose}
    >
      <ForgotPasswordForm
        onSubmit={props.onSubmit}
        submitting={props.submitting}
        submitError={props.submitError}
        initialValues={props.initialValues}
      />
    </Dialog>
  );
}
