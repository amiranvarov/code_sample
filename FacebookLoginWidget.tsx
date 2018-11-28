import "./assets/facebook.scss";

import { FACEBOOK_APP_ID } from "@getpack/core";
import { FacebookUserDTO } from "@getpack/core-api";
import { plainToClass } from "class-transformer";
/* eslint-disable no-underscore-dangle */
import React from "react";

import { FacebookIcon } from "../icons/Facebook";

const decodeParamForKey = (paramString: string, key: string) =>
  decodeURIComponent(
    paramString.replace(
      new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^(?:.*[&\\?]${encodeURIComponent(key).replace(
          // eslint-disable-next-line no-useless-escape
          /[\.\+\*]/g,
          "\\$&",
        )}(?:\\=([^&]*))?)?.*$`,
        "i",
      ),
      "$1",
    ),
  );

const getParamsFromObject = (params: object) =>
  `?${Object.keys(params)
    // @ts-ignore
    .map((param: string) => `${param}=${encodeURIComponent(params[param])}`)
    .join("&")}`;

const getIsMobile = () => {
  let isMobile = false;

  try {
    isMobile = !!(
      (window.navigator && (window as any).navigator.standalone) ||
      navigator.userAgent.match("CriOS") ||
      navigator.userAgent.match(/mobile/i)
    );
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

interface CheckLoginResponse {
  status?: string;
}

interface Props {
  isDisabled?: boolean;
  onAuth: (user: FacebookUserDTO) => void;
  xfbml?: boolean;
  cookie?: boolean;
  authType?: string;
  scope?: string;
  state?: string;
  responseType?: string;
  returnScopes?: boolean;
  redirectUri?: string;
  autoLoad?: boolean;
  disableMobileRedirect?: boolean;
  isMobile?: boolean;
  fields?: string;
  version?: string;
  language?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  appId?: string;
  onFailure?: (error: string) => void;
}

export class FacebookLoginWidget extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    this.click = this.click.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
  }

  public static defaultProps = {
    appId: FACEBOOK_APP_ID,
    redirectUri: typeof window !== "undefined" ? window.location.href : "/",
    scope: "public_profile,email",
    returnScopes: false,
    xfbml: false,
    cookie: false,
    authType: "",
    fields: "name",
    version: "2.3",
    language: "en_US",
    disableMobileRedirect: false,
    isMobile: getIsMobile(),
    state: "facebookdirect",
    responseType: "code",
  };

  public state = {
    isSdkLoaded: false,
    isProcessing: false,
  };

  public _isMounted: boolean;

  public componentDidMount() {
    this._isMounted = true;
    if (document.getElementById("facebook-jssdk")) {
      this.sdkLoaded();

      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
    let fbRoot = document.getElementById("fb-root");

    if (!fbRoot) {
      fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.state.isSdkLoaded && nextProps.autoLoad && !this.props.autoLoad) {
      (window as any).FB.getLoginStatus(this.checkLoginAfterRefresh);
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  private setStateIfMounted(state: any) {
    if (this._isMounted) {
      this.setState(state);
    }
  }

  private setFbAsyncInit() {
    const { appId, xfbml, cookie, version, autoLoad } = this.props;

    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });
      this.setStateIfMounted({ isSdkLoaded: true });
      if (autoLoad || this.isRedirectedFromFb()) {
        (window as any).FB.getLoginStatus(this.checkLoginAfterRefresh);
      }
    };
  }

  private isRedirectedFromFb() {
    const params = window.location.search;

    return (
      decodeParamForKey(params, "code") ||
      decodeParamForKey(params, "granted_scopes")
    );
  }

  private sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  private loadSdkAsynchronously() {
    const { language } = this.props;

    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;

      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      // @ts-ignore
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      // @ts-ignore
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  private responseApi = (authResponse: any) => {
    (window as any).FB.api(
      "/me",
      { locale: this.props.language, fields: this.props.fields },
      (me: any) => {
        this.handleAuth({ ...me, ...authResponse });
      },
    );
  };

  private checkLoginState = (response: any) => {
    this.setStateIfMounted({ isProcessing: false });
    const { onFailure } = this.props;

    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else if (onFailure) {
      onFailure(response.status);
    }
  };

  public checkLoginAfterRefresh = (response: CheckLoginResponse) => {
    if (response.status === "connected") {
      this.checkLoginState(response);
    } else {
      (window as any).FB.login(
        (loginResponse: any) => this.checkLoginState(loginResponse),
        true,
      );
    }
  };

  public click = (e: React.MouseEvent<HTMLElement>) => {
    if (
      !this.state.isSdkLoaded ||
      this.state.isProcessing ||
      this.props.isDisabled
    ) {
      return;
    }
    this.setState({ isProcessing: true });
    const {
      scope,
      appId,
      onClick,
      returnScopes,
      responseType,
      redirectUri,
      disableMobileRedirect,
      authType,
      state,
    } = this.props;

    if (typeof onClick === "function") {
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }
    }

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      return_scopes: returnScopes,
      scope,
      response_type: responseType,
      auth_type: authType,
    };

    if (this.props.isMobile && !disableMobileRedirect) {
      window.location.href = `//www.facebook.com/dialog/oauth${getParamsFromObject(
        params,
      )}`;
    } else {
      (window as any).FB.login(this.checkLoginState, {
        scope,
        return_scopes: returnScopes,
        auth_type: params.auth_type,
      });
    }
  };

  public render() {
    const { isSdkLoaded } = this.state;

    if (isSdkLoaded) {
      return (
        <button
          type="button"
          className="facebook-login-btn"
          onClick={this.click}
        >
          <FacebookIcon />
        </button>
      );
    }

    return <div />;
  }

  private handleAuth(user: object) {
    const { onAuth } = this.props;

    /**
     * TODO: add add verification for provided email
     * if in provided email phone is stored, move it to phone
     */
    onAuth(plainToClass(FacebookUserDTO, user));
  }
}
