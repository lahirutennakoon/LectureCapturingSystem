#!/usr/bin/python
import cv2
import time
import numpy as np
import os 



class Camera():
	# Constructor...
	def __init__(self):
		# w     = 640			# Frame width...
		# h     = 480			# Frame hight...
		# fps   = 20.0                    # Frames per second...
		# resolution = (w, h)         	# Frame size/resolution...
 
		


		self.cap = cv2.VideoCapture(0)  # Prepare the camera...
		self.cap.set(3, 640) # set video widht
		self.cap.set(4, 480) # set video height
		
		# Define min window size to be recognized as a face
		self.minW = 0.1*self.cap.get(3)
		self.minH = 0.1*self.cap.get(4)
		print("Camera warming up ...")
		time.sleep(1)
		
		
		
		# Do a bit of cleanup
		# print("\n [INFO] Exiting Program and cleanup stuff")
		# cam.release()
		# cv2.destroyAllWindows()
		
		# Prepare output window...
		# self.winName = "Motion Indicator"
		# cv2.namedWindow(self.winName, cv2.WINDOW_AUTOSIZE)
 
		# Define the codec and create VideoWriter object
		# self.fourcc = cv2.VideoWriter_fourcc(*'H264')     # You also can use (*'XVID')
		# self.out = cv2.VideoWriter('output.avi',self.fourcc, fps, (w, h), True)
		
	
	# Frame generation for Browser streaming wiht Flask...	
	def get_frame(self):
		recognizer = cv2.face.LBPHFaceRecognizer_create()
		recognizer.read('trainer/trainer.yml')
		cascadePath = "haarcascade_frontalface_default.xml"
		faceCascade = cv2.CascadeClassifier(cascadePath);
		
		font = cv2.FONT_HERSHEY_SIMPLEX

		#iniciate id counter
		id = 0

		# names related to ids: example ==> Marcelo: id=1,  etc
		names = ['None', 'Ashen', 'Paula', 'Ilza', 'Z', 'W'] 
		self.frames = open("stream.jpg", 'wb+')
		
		while True:
			
			# Prepare Capture
			s, img = self.cap.read()
	 
			gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

			faces = faceCascade.detectMultiScale( 
				gray,
				scaleFactor = 1.2,
				minNeighbors = 5,
				minSize = (int(self.minW), int(self.minH)),
			)
			
			for(x,y,w,h) in faces:

				cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)

				id, confidence = recognizer.predict(gray[y:y+h,x:x+w])

				# Check if confidence is less them 100 ==> "0" is perfect match 
				if (confidence < 100):
					id = names[id]
					confidence = "  {0}%".format(round(100 - confidence))
				else:
					id = "unknown"
					confidence = "  {0}%".format(round(100 - confidence))
				
				cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
				cv2.putText(img, str(confidence), (x+5,y+h-5), font, 1, (255,255,0), 1) 
			if s:	# frame captures without errors...
				cv2.imwrite("stream.jpg", img)	# Save image...
			return self.frames.read()
			#cv2.imshow('camera',self.frame) 
			# Read three images first...
			# self.prev_frame     = cv2.cvtColor(self.cap.read()[1],cv2.COLOR_RGB2GRAY)
			# self.current_frame  = cv2.cvtColor(self.cap.read()[1],cv2.COLOR_RGB2GRAY)
			# self.next_frame	    = cv2.cvtColor(self.cap.read()[1],cv2.COLOR_RGB2GRAY)
			k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
			if k == 27:
				break
		
        
			
	def diffImg(self, tprev, tc, tnex):
		# Generate the 'difference' from the 3 captured images...
		Im1 = cv2.absdiff(tnex, tc)
		Im2 = cv2.absdiff(tc, tprev)
		return cv2.bitwise_and(Im1, Im2)
 
	def captureVideo(self):
		# Read in a new frame...
		self.ret, self.frame = self.cap.read()
		# Image manipulations come here...
                # This line displays the image resulting from calculating the difference between
                # consecutive images...
		diffe = self.diffImg(self.prev_frame, self.current_frame, self.next_frame)
		cv2.imshow(self.winName,diffe)
		
		# Put images in the right order...
		self.prev_frame		= self.current_frame
		self.current_frame	= self.next_frame
		self.next_frame		= cv2.cvtColor(self.frame, cv2.COLOR_RGB2GRAY)
		return()
 
	def saveVideo(self):
		# Write the frame...
		self.out.write(self.frame)
		return()
 
	def __del__(self):
		self.cap.release()
		cv2.destroyAllWindows()
		self.out.release()
		print("Camera disabled and all output windows closed...")
		return()

	def releaseCam(self):
		self.cap.release()
		cv2.destroyAllWindows()
		print("Camera disabled and all output windows closed...")
		return()
 
def main():
	# Create a camera instance...
	cam1 = Camera()
 
	while(True):
		# Display the resulting frames...
		cam1.captureVideo()    # Live stream of video on screen...
		cam1.saveVideo()       # Save video to file 'output.avi'...
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break
	return()
 
if __name__=='__main__':
	main()