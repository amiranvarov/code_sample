import React, { ReactNode } from "react";

interface Props {
  title: ReactNode | string;
}

export function AuthModalTitle(props: Props) {
  return (
    <div className="d-flex flex-grow-1 flex-shrink-1 justify-content-center font-weight-bold text-uppercase text-primary text-center modal-sign-in-title">
      {props.title}
    </div>
  );
}
