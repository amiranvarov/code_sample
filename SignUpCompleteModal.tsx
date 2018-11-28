import "./assets/modals.scss";

import { noop } from "lodash-es";
import React from "react";

import { I18nText } from "../i18n/I18nText";
import { Dialog } from "../ui/Dialog";
import { AuthModalTitle } from "./AuthModalTitle";
import {
  RegisterCompleteForm,
  RegisterCompleteFormValues,
} from "./RegisterCompleteForm";

interface Props {
  open: boolean;

  submitError?: Error;
  submitting: boolean;
  onSubmit: (values: RegisterCompleteFormValues) => void;
}

export function SignUpCompleteModal(props: Props) {
  return (
    <Dialog
      open={props.open}
      onRequestClose={noop}
      withCloseButton={false}
      className="modal-authorization"
      bodyClassName="modal-authorization-body"
      title={
        <AuthModalTitle
          title={<I18nText code="RegisterCompleteFormCreatePassword" />}
        />
      }
    >
      <RegisterCompleteForm
        onSubmit={props.onSubmit}
        submitting={props.submitting}
        submitError={props.submitError}
      />
    </Dialog>
  );
}
