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
    telegram: string;
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
    report_account: string;
    reported: string;
    reporting: string;
    report_success_title: string;
    report_error_title: string;
    report_success_message: string;
    report_limit_message: string;
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
    name: string;
    name_placeholder: string;
    email: string;
    email_placeholder: string;
    message: string;
    message_placeholder: string;
    submit: string;
    submitting: string;
    success_title: string;
    success_message: string;
    error_title: string;
    error_name_message: string;
    error_email_message: string;
    error_message_message: string;
    error_general_message: string;
  };
  docs: {
    title: string;
    description: string;
    how_it_works: {
      title: string;
      description: string;
      step1: string;
      step2: string;
      step3: string;
      join_channel: string;
    };
    safety_guide: {
      title: string;
      description: string;
      point1: string;
      point2: string;
    };
    mail_access: {
      title: string;
      description: string;
    };
    faq: {
      title: string;
      q1_title: string;
      q1_answer: string;
      q2_title: string;
      q2_answer: string;
      q3_title: string;
      q3_answer: string;
      q4_title: string;
      q4_answer: string;
    }
  };
  footer: {
    disclaimer_title: string;
    disclaimer_text: string;
    rights_reserved: string;
  };
}
