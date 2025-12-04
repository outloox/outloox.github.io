export interface Account {
  id: string;
  email: string;
  password?: string;
  country: string;
  services?: string[];
  createdAt: string; // ISO 8601 date string
  reportCount?: number;
  link?: string; // The direct link to the check bot
}

export interface SiteSettings {
  maintenance_mode: boolean;
}

export interface Dictionary {
  header: {
    title: string;
    home: string;
    dashboard: string;
    contact: string;
    docs: string;
  };
  landing: {
    title: string;
    description: string;
    get_started: string;
  };
  home: {
    title: string;
    description: string;
    noAccounts: string;
    noAccounts_desc: string;
    error: string;
    error_desc: string;
    account_prefix: string;
    email: string;
    password: string;
    country: string;
    services: string;
    posted_today: string;
    posted_previously: string;
    copied_to_clipboard: string;
    services_toast_title: string;
    services_toast_message: string;
    copy_button: string;
    copied_button: string;
    check_account_button: string;
  };
  contact: {
    title: string;
    description: string;
    telegram_user: string;
    telegram_user_placeholder: string;
    message: string;
    message_placeholder: string;
    submit: string;
    submitting: string;
    success_title: string;
    success_message: string;
    error_title: string;
    error_telegram_message: string;
    error_message_message: string;
    error_general_message: string;
  };
  docs: {
    title: string;
    description: string;
    how_it_works: {
      title: string;
      step1: string;
      step2: string;
      step3: string;
    };
    safety_guide: {
      title: string;
      description: string;
      point1: string;
      point2: string;
      point3: string;
    },
    basics: {
      title: string;
      questions: {
        [key: string]: {
          q: string;
          a: string;
        }
      }
    },
     verification_process: {
      title: string;
      questions: {
        [key: string]: {
          q: string;
          a: string;
        }
      }
    },
    troubleshooting: {
      title: string;
      questions: {
        [key: string]: {
          q: string;
          a: string;
        }
      }
    }
  };
  footer: {
    rights_reserved: string;
  };
}
