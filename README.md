Dùng sequelize để tương tác với postgres, trong file index có đoạn comment để đồng bộ db, sẽ tự động tạo các bảng:
Uncomment dòng này để tạo mới db:
```js
// db.sequelize.sync({ force: true });
```
Uncomment dòng này (sau khi tạo thành công và comment lại dòng trên) để tạo tài khoản admin, mật khẩu admin:
```js
// db.User.create({
//     username: 'admin',
//     email: 'abc@gmail.com',
//     password: '$2a$10$tLB8GqgbFjgF0iiGHdG0pOF/4gCo79dZOboRrjkfVjIJywYRgkCBe',
//     fullname: 'Admin',
//     role: 'admin'
// });
```
Sau khi tạo xong thì comment tất cả lại.

#### 1 số lưu ý:
User được gộp lại, thêm trường role (admin, customer) dành cho việc xác thực 2 loại người dùng
Image được tạo 1 bảng riêng và upload trên cloudinary
Sẽ thêm liên kết giữa server admin và customer: khi user đăng nhập thành công bên trang web bán hàng, nếu có role là admin sẽ có nút truy cập vào trang admin.

#### Task chưa hoàn thành:
1. order route
2. chart
3. thông báo
