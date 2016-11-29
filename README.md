This is a project of course comp4021 in HKUST.

Enviroment: Windows 10, Appach 2.4.23, Php 7.0.10, Chrome 54.0.2840.99 m (64-bit)

Test: copy everything inside "chat/" into "www/", type "localhost/index.html" in address bar.

This project only implements a prototype. Consideration about thread competition and excption handling is lacked.So don't try to test its robustness.

All reading and writing action assume file manipulation is fast and secure enough so that there is not any extra efforts to maintain data consistency or file manipulation failure. Thus if any unexpected action that may be caused by above reason appears, just use files offered in "empty_data" to overwrite files in "data" and reboot the whole system, which will flush all data.

There is a problem that hasn't been solved perfectly yet. When a room page is closed, the user should be considered as logging out. This project will send a AJAX request back to server to log out. But the behaviour of "onunload" varies among different browsers. So a log-out action is not 100% guaranteed in an arbitrary browser, which may lead to mess in server data. The proper behaviour can be guaranteed if this project is tested in the enviroment clarified above.

There are already four accounts stored in server data. Their usernames are "AAA", "BBB", "CCC", "DDD" and the password is the same as usernames. If you want to test this project from scratch, use files in "empty_data" to overwrite files in "data".

When registering a new account, the photo size is limited to 2M at most by a javascript validation. However, the photo size is also limited by php configuration. If the php configuration limits the photo size to less than 2M, you'll pass the front-end validation but php script can't get access to you photo. In this case, your registration succeeds but your profile won't display at the top-left corner if you log in.

As for the user list, it will be triggered by a click on a user profile. All users will be displayed on it. But the offline user's photo will be turned to gray scale to distinguish from online users.
