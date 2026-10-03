export const ADMIN_COOKIE = 'ss_admin_session';
export const PRESTA_COOKIE = 'ss_presta_session';

export interface AdminSessionPayload {
  role: 'admin';
  adminId: string;
  email: string;
}

export interface PrestataireSessionPayload {
  role: 'prestataire';
  prestataireId: string;
}

export type StaffSession =
  | { role: 'admin'; session: AdminSessionPayload }
  | { role: 'prestataire'; session: PrestataireSessionPayload };
