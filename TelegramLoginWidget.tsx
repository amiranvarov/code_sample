import "./assets/telegram.scss";

import { TelegramUserDTO } from "@getpack/core-api";
import { plainToClass } from "class-transformer";
import React from "react";

import { TelegramIcon } from "../icons/TelegramIcon";

const BOT_NAME = "gtp1TestBot";

enum BUTTON_SIZE {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

const REQUEST_ACCESS = "write";

interface Props {
  onAuth: (user: TelegramUserDTO) => void;
}

export const TelegramLoginButton = ({ onAuth }: Props) => (
  <button type="button" className="telegram-login-button">
    <TelegramIcon
      fill="#ffffff"
      width={36}
      height={36}
      className="telegram-plane-icon"
    />
    <TelegramLoginWidget onAuth={onAuth} />
  </button>
);

export class TelegramLoginWidget extends React.Component<Props> {
  private instance: any;

  public componentDidMount() {
    const { onAuth } = this.props;

    // @ts-ignore
    window.TelegramLoginWidget = {
      dataOnauth: (user: object) => onAuth(plainToClass(TelegramUserDTO, user)),
    };

    const script = document.createElement("script");

    script.src = "https://telegram.org/js/telegram-widget.js?4";
    script.setAttribute("data-telegram-login", BOT_NAME);
    script.setAttribute("data-size", BUTTON_SIZE.LARGE);
    script.setAttribute("data-request-access", REQUEST_ACCESS);
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.async = true;
    this.instance.appendChild(script);
  }

  public render() {
    return (
      <div
        className="telegram-login-widget"
        ref={component => {
          this.instance = component;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
