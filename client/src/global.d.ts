export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.accounts.id {
    function initialize(config: {
      client_id: string;
      callback: (response: CredentialResponse) => void;
    }): void;

    function renderButton(
      parent: HTMLElement,
      options: {
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'small' | 'medium' | 'large';
        width?: string | number;
        type?: 'standard' | 'icon';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signup_with';
        locale?: string;
      }
    ): void;

    interface CredentialResponse {
      credential: string;
      select_by: string;
      clientId?: string;
    }
  }
}
