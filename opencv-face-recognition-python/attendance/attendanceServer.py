#!/usr/bin/env python
from flask import Flask, render_template, Response
 
# emulated camera
from camera import Camera
 
# If you are using a webcam -> no need for changes
# if you are using the Raspberry Pi camera module (requires picamera package)
# from camera_pi import Camera
 
app = Flask(__name__)
 
 
@app.route('/')
def index():
    """Video streaming home page."""
    return "Attendance Flask server"
 
 
def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + bytearray(frame) + b'\r\n')
 
 
@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

def releaseFunc(camera):
    """Video streaming route. Put this in the src attribute of an img tag."""
    camera.releaseCam()

@app.route('/cam_Release')
def release():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return releaseFunc(Camera())
 
 
if __name__ == '__main__':
    app.run(port=5004)