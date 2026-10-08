export interface ICreateLabelPayload {
  name: string;
  color?: string;
}

export interface IUpdateLabelPayload {
  name?: string;
  color?: string;
}

export interface IAssignLabelPayload {
  taskId: string;
}
