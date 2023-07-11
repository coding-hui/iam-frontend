export interface RecordType {
  key: string;
  title: string;
  description: string;
}
export const TRANSFER_TYPE = {
  USER: 'user',
  ROLE: 'role',
} as const;
export type TransferType = ValueOf<typeof TRANSFER_TYPE>;
