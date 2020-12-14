# SjShare

**SjShare**

SjShare is an application for Windows 10(64bit).  
The webcam must be connected at startup.  
Test effects are assigned to 0 to 9 of the keys on the keyboard.  
Press a key 0-9 to change shader.  
Each shader can be changed by replacing the code of the shader file under the "data/shaderes" folder.  
Shader coding is similar to ShaderToy except for the first line.  
The field to the left of the ":" is the mouse or sounds switch, and the field to the right is the multipath shader description.  
If you don't use multipath shaders, mouse or sounds, just start the line "//" and the shadertoy.com code will work.
However, the screen may turn upside down, in which case  
Insert code such as "uv.y = -uv.y" to fix it.  
I think most of the code on "ShaderToy.com" works,  
Some features are not supported.  
This version does not support the face landmarks function or the function that becomes a virtual camera for ZOOM.  
Also, in this version, only 9 shaders are assigned to the keys, but in the pro version, 100 or more can be assigned. 


You can change the dimensions of the display window with "MySettings.exe".  
The Spacebar toggles the export of frame-by-frame images to the "data/export" folder.


**Sample of multipath shader description**    

**//:0v**  
0 => channel number, v => webcam  
Enter the webcam image into channel 0 of the main buffer  

**//:0ab,1bb,0b,0va,1v**  
       0ab       0=>channnel number, ab -> copy buffer from a to b  
       1bb       1=>channnel number, bb -> copy buffer b to b  
        0b       input buffer b to channnel 0 of base layer  
        0v       input webcam texture to channnel 0 of base layer  
        1v       input webcam texture to channnel 1 of base layer  

**header for "Sirenian Dawn https://www.shadertoy.com/view/XsyGWV"**
"Sirenian Dawn" uses A, B, C, and Image(main)Buffer.
And also uses internal noise texture.
Header is as follows,

//M:0gMa,1rLa,0ab,1bb,0bc,1cc

0gMa  ->  input middle size gray noise texture　to A buffer thru 0 channnel  
1rLa  ->  input large size rgb noise texture to A buffer thru 1 channel  

gL gray Large noise texture  
gM gray Middle noise texture  
gS gray Small  noise texture  
g,[noize texture size]  

rL rgb Large noise texture  
rM rgb Middle noise texture  
rS rgb Small  noise texture  
r,[noize texture size]  


**2020/12/14 Sj.exe shaders uploaded.  major chage of y axis issue** 
