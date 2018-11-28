import "./assets/modals.scss";

import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import {
  RestorePasswordForm,
  RestorePasswordFormValues,
} from "./RestorePasswordForm";

interface Props {
  open: boolean;
  onRequestClose: () => void;

  phone: string;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: RestorePasswordFormValues) => void;

  onResendClick: () => void;
}

export function RestorePasswordModal(props: Props) {
  return (
    <Dialog
      open={props.open}
      title={
        <AuthModalTitle
          title={<I18nText code="RegisterVerificationFormVerification" />}
        />
      }
      className="modal-authorization"
      bodyClassName="modal-authorization-body"
      onRequestClose={props.onRequestClose}
    >
      <RestorePasswordForm
        phone={props.phone}
        submitting={props.submitting}
        submitError={props.submitError}
        onSubmit={props.onSubmit}
        onResendClick={props.onResendClick}
      />
    </Dialog>
  );
}
