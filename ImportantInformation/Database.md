{
  Database: {
    Projects: {
      [uniqueProjectID]: {
        ID: "uniqueProjectID",
        dueDate: "DATE MM DD YYYY",
        tasks: {
          0: "taskID1",
          1: "taskID2",
          ...
        },
        text: "Description of Project",
        title: "Title of Project",
        users: {
          0: "userID1",
          1: "userID2",
          ...
        },
      },
      ...
    }
    Tasks: {
      [uniqueTaskID]:{
        ID: "uniqueTaskID",
        assigned: {
          0: "userID1",
          1: "userID2",
          ...
        },
        due: "DATE MM DD YYYY",
        parentTask: "uniqueParentTaskID" or "none",
        project: "projectID",
        status: "INCOMPLETE" or "COMPLETE",
        text: "Description of Task",
        title: "Task Title",
      },
      ...
    },
    Users: {
      [uniqueUserID]:{
        ID: "uniqueUserID",
        Password: "password",
        Reference: {
          theme: "dark" or "light",
        },
        Username: "username",
        projects: {
          0: "projectID1",
          1: "projectID2",
          ...
        },
      },
      ...
    }
  }
}