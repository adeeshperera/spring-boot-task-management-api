export enum TaskStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTaskStatus(value: any): value is TaskStatus {
  return Object.values(TaskStatus).includes(value);
}
