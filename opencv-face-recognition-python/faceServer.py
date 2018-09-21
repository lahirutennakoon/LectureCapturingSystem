#
# @author ashen
#

from flask import Flask, request, render_template, Response
import json
import cv2
import os
import numpy as np
import sys


app = Flask(__name__)

subjects = ["", "ashen","lahiru","vimukthi"]
faces = []
labels = []
#create our LBPH face recognizer 
face_recognizer = cv2.face.LBPHFaceRecognizer_create()
# face_recognizer = cv2.face.EigenFaceRecognizer_create()
# face_recognizer = cv2.face.FisherFaceRecognizer_create()

@app.route('/')
def index():
	return "Flask server"

@app.route('/train')
def prepare_training_data():
    faces = []
    labels = []

    print("faces :",faces )
    print("labels :", labels)

    data_folder_path = "./training-data"
    dirs = os.listdir(data_folder_path)
 
    for dir_name in dirs:   
        if not dir_name.startswith("s"):
            continue;       
  
        label = int(dir_name.replace("s", ""))
        
        subject_dir_path = data_folder_path + "/" + dir_name
        
        subject_images_names = os.listdir(subject_dir_path)
        
        for image_name in subject_images_names:
            
            if image_name.startswith("."):
                continue;
            
            image_path = subject_dir_path + "/" + image_name
            image = cv2.imread(image_path)
            # cv2.imshow("Training on image...", cv2.resize(image, (400, 500)))
            # cv2.waitKey(100)
            face, rect = detect_face(image)
            
            if face is not None:
                faces.append(face)
                labels.append(label)

    print("Training Starting...")
    print("faces :",faces )
    print("labels :", labels)
    #train our face recognizer of our training faces
    face_recognizer.train(faces, np.array(labels))
    print("Training Finished...")
    # cv2.destroyAllWindows()
    # cv2.waitKey(1)
    # cv2.destroyAllWindows()   
    return "Successfully Trained!"


@app.route('/postdata')
def postdata():

    test_img1 = cv2.imread("./test-data/test.jpg")

    #perform a prediction
    predicted_img1 = predict(test_img1)
    # predicted_img2 = predict(test_img2)
    print("Prediction complete")

    if predicted_img1 is None:
        return json.dumps({"name":"error"})
    else:
        return json.dumps({"name":predicted_img1})


def predict(test_img):
    #make a copy of the image as we don't want to chang original image
    img = test_img.copy()
    #detect face from the image
    face, rect = detect_face(img)

    #predict the image using our face recognizer 
    label, confidence = face_recognizer.predict(face)
    #get name of respective label returned by face recognizer

    label_text = subjects[label]
    print("Predicted Name :", label_text)
    print("confidence :", confidence)
    return label_text


def detect_face(img):
    #convert the test image to gray image as opencv face detector expects gray images
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    #load OpenCV face detector, I am using LBP which is fast
    #there is also a more accurate but slow Haar classifier
    #face_cascade = cv2.CascadeClassifier('./opencv-files/lbpcascade_frontalface.xml')
    face_cascade = cv2.CascadeClassifier('./opencv-files/haarcascade_frontalface_default.xml')
    #let's detect multiscale (some images may be closer to camera than others) images
    #result is a list of faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(20, 20))
    
    #if no faces are detected then return original img
    if (len(faces) == 0):
        print("No Detected Face")
        return None, None
    
    #under the assumption that there will be only one face,
    #extract the face area
    (x, y, w, h) = faces[0]
    
    #return only the face part of the image
    return gray[y:y+w, x:x+h], faces[0]


if __name__ == "__main__":
	app.run(port=5003)