user login API with JWT authentication.
POST : localhost:5000/api/users/login
![image](https://github.com/user-attachments/assets/c79e29e2-09b5-4f44-a2cf-e11fa8b669bc)

user registration API
POST : localhost:5000/api/users/register

User Management APIs
1. create user
   POST : localhost:5000/api/users/add_user
2. get all users
   GET : localhost:5000/api/users/all_users
3. get user by ID
   GET : localhost:5000/api/users/get_user/{id}
4. update user by ID
   PUT : localhost:5000/api/users/update_user/
5. delete user by ID
   DELETE : localhost:5000/api/users/delete_user/

Inventory Management APIs
1. add new item
   POST : localhost:5000/api/inventory/add_new_item
2. get all items
   GET : localhost:5000/api/inventory/all_items
3. get item by ID
   GET : localhost:5000/api/inventory/get_item/{id}
4. update item by ID
   PUT : localhost:5000/api/inventory/update_item/{id}
5. delete item by ID
   DELETE : localhost:5000/api/inventory/delete_item/{id}
