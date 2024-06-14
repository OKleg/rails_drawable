import consumer from "channels/consumer";

consumer.subscriptions.create("DrawChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("connected");

    this.listenToCanvas();
  },
  listenToCanvas() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.remoteContext = this.canvas.getContext("2d");

    this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
  },
  startDrawing(event) {
    console.log("startDrawing");
    this.isDrawing = true;
    this.lastX = event.offserX;
    this.lastY = event.offserY;
    this.lastSent = Date.now();

    this.perform("draw", {
      x: event.offsetX,
      y: event.offsetY,
      state: "start",
    });
  },

  draw(event) {
    console.log("draw");

    if (!this.isDrawing) return;

    if (Date.now() - this.lastSent > 4) {
      this.perform("draw", {
        x: event.offsetX,
        y: event.offsetY,
        state: "drawing",
      });
      this.lastSent = Date.now();
    }
    this.drawData(event.offserX, event.offserY);
  },

  drawData(x, y) {
    console.log("drawData");

    this.context.lineJoin = "round";
    this.context.lineCap = "round";

    //start from
    this.context.beginPath();

    //go to the old position
    this.context.moveTo(this.lastX, this.lastY);
    //go to the new position
    this.context.lineTo(x, y);
    this.context.stroke();

    //set the new position as the current one
    this.lastX = x;
    this.lastY = y;
  },
  drawRemoteData(x, y) {
    console.log("drawRemoteData");
    this.context.lineJoin = "round";
    this.context.lineCap = "round";
    //start from
    this.context.beginPath();
    //go to the old position
    this.context.moveTo(this.remoteLastX, this.remoteLastY);
    //go to the new position
    this.context.lineTo(x, y);
    this.context.stroke();
    //set the new position as the current one
    this.remoteLastX = x;
    this.remoteLastY = y;
  },

  stopDrawing(event) {
    console.log("stopDrawing");

    this.isDrawing = false;
    this.lastX = event.offserX;
    this.lastY = event.offserY;
    this.lastSent = Date.now();

    this.perform("draw", {
      x: event.offsetX,
      y: event.offsetY,
      state: "stop",
    });
  },
  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("received");

    // Called when there's incoming data on the websocket for this channel
    if (data.state === "start") {
      this.remoteLastX = data.x;
      this.remoteLastY = data.y;
      return;
    }
    if (data.state === "stop") {
      this.remoteLastX = data.x;
      this.remoteLastY = data.y;
      return;
    }

    this.drawRemoteData(data.x, data.y);
  },
});
