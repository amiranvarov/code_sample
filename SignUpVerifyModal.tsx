import "./assets/modals.scss";

import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import {
  RegisterVerifyForm,
  RegisterVerifyFormValues,
} from "./RegisterVerifyForm";

interface Props {
  open: boolean;
  onRequestClose: () => void;

  phone: string;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: RegisterVerifyFormValues) => void;

  onResendClick: () => void;
}

export function SignUpVerifyModal(props: Props) {
  return (
    <Dialog
      open={props.open}
      title={
        <AuthModalTitle
          title={<I18nText code="RegisterVerificationFormVerification" />}
        />
      }
      className="modal-authorization"
      onRequestClose={props.onRequestClose}
      bodyClassName="modal-authorization-body"
    >
      <RegisterVerifyForm
        phone={props.phone}
        submitting={props.submitting}
        submitError={props.submitError}
        onSubmit={props.onSubmit}
        onResendClick={props.onResendClick}
      />
    </Dialog>
  );
}
