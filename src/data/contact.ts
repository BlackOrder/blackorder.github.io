/* Single source of truth for contact data (behavior/content § contact mechanism).
   `github` is the mandatory launch contact/trust anchor; `email` is optional (rendered only if set). */
export interface Contact {
  github: string; // non-empty https://github.com/ URL — deploy gate
  email?: string;
}

export const contact: Contact = {
  github: 'https://github.com/BlackOrder',
  // email: '', // v2: custom-domain email
};
