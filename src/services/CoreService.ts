export class CoreService {
  constructor() {}
  static setTask(data: any) {
    return localStorage.setItem("tasks", data);
  }
  static getTask(): any {
    return localStorage.getItem("tasks");
  }
}
