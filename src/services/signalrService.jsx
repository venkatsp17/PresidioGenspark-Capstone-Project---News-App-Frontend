import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://newsapp-ehf4azf8cshmakdj.westus2-01.azurewebsites.net/commentHub",
        {
          accessTokenFactory: () => {
            const storedUser = localStorage.getItem("user");
            return JSON.parse(atob(storedUser)).token;
          },
        }
      )
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onclose(this.onDisconnected.bind(this));
    this.connection.onreconnecting(this.onReconnecting.bind(this));
    this.connection.onreconnected(this.onReconnected.bind(this));
  }

  async start() {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
        // console.log("SignalR Connected.");
      }
    } catch (err) {
      // console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.start(), 5000);
    }
  }

  async joinGroup(articleId) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        // console.log(typeof articleId);
        await this.connection.invoke("JoinGroup", articleId.toString());
        // console.log("Group Connected.", articleId);
      } catch (err) {
        // console.error("Error joining group: ", err);
      }
    } else {
      // console.log("Connection not in Connected state.");
    }
  }

  async leaveGroup(articleId) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeaveGroup", articleId.toString());
        // console.log("Group Left .");
      } catch (err) {
        // console.error("Error leaving group: ", err);
      }
    } else {
      // console.log("Connection not in Connected state.");
    }
  }

  onReceiveComment(callback) {
    this.connection.on("ReceiveComment", callback);
  }

  onUpdateCommentCount(handler) {
    this.connection.on("UpdateCommentCount", handler);
  }

  onSaveArticleCount(handler) {
    this.connection.on("UpdateSaveArticleCount", handler);
  }

  onShareCount(handler) {
    this.connection.on("UpdateShareCount", handler);
  }

  onDisconnected() {
    // console.log("SignalR connection closed. Attempting to reconnect...");
    setTimeout(() => this.start(), 5000);
  }

  onReconnecting() {
    // console.log("SignalR reconnecting...");
  }

  onReconnected() {
    // console.log("SignalR reconnected.");
  }
}

const signalRService = new SignalRService();
export default signalRService;
