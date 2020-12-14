# 🦊 hcmus-web-academy
HWA Final Project  - Web course HCMUS 

# Các công cụ cần thiết
1. Nodejs
2. Gulp
3. Express
4. Yarn 
5. MongoDB
6. MongoCompass (Quản lý Mongo)

# Folder Structure
┣ 📂docs\
┣ 📂src\
┣ ┗ 📂controllers\
┣ ┗ 📂middleware\
┣ ┗ 📂models\
┣ ┗ 📂public\
┣ ┗ 📂routes\
┣ ┗ 📂scss\
┣ ┗ 📂seeders\
┣ ┗ 📂utils\
┣ ┗ 📂views\
┣ ┗ 📜index.js\
📜.envexample
📜Readme.md


## Description
controllers: xử lý request, logic, trả về kết quả
models: Chứa các model schema của các bảng trong DB
public: Chứa các css, js, img
routes: Cấu hình route express với url tương ứng
scss: Dùng scss cho web
utils: Các module hỗ trợ, nếu cần thiết thì thêm vào đây
views: Chứa template hbs để render
  - helpers: chứa module custom helper cho template hbs
  - layouts: Các layout xây dựng
  - pages: Chứa các file hbs tương ứng với các trang (phần main content)
  - partials: File cấu trúc thành phầN trang

# Flow cần quan tâm khi phát triển 1 tính năng
## Flow
- Tạo 1 tệp hbs trong thư mục `views/pages` có thể cấu trúc trong thư mục con (ví dụ làm các chức năng users thì thêm vào views/pages/users/profile.hbs)
- Tạo 1 tệp trong thư mục `routes` tương tự như `user.route.js`, các chức năng không nằm trong user có thể tạo module khác. Cấu trúc trong tệP tin tham khảo user.route.js
- Tạo 1 tệp trong thư mục `controllers` để đón request. Tham khảo `user.js` để xử lý GET, POST
- Chú ý: Tạo file kiểu module này nhớ export các hàm ra để file khác có thể gọi
## Các cấu hình có sẵn
- Sử dụng {{user}} trong hbs để có dữ liệu bản ghi user đang đăng nhập
  + Ví dụ: 
  ```hbs
    {{#if user}}
      Chào bạn, {{user.username}}
    {{#else}}
      Bạn chưa đăng nhập
    {{/if}}
    
  ```
- Nếu muốn custom helper để gọi thì thêm vào 1 function tương tự trong `views/helpers/helper.js`

  + Sử dụng:
  ```hbs
    {{#if user}}
      Chào bạn, {{user.username}} 
      Loại tài khoản {{getTypeAccountHelper user.role}}
    {{#else}}
      Bạn chưa đăng nhập
    {{/if}}
  ```
## Yêu cầu ngoài tính năng
- Những chi tiết thừa không có dự định sử dụng xóa để tránh không cần thiết
- Có thể viết template mới trong layouts, partials (file include trong layouts) và dùng `res.render('pages/<trang>', {layout: 'file trong layout'})` để sử dụng tránh lặp đi lặp lại code nhiều lần (option nếu kiểm soát sử dụng được)
- Yêu cầu giao diện phải thân thiện khi responsive trang mobile
- Khuyến khích sử dụng icon 

## Yêu cầu git
- Push lên git với branch của mình không push lên branch người khác
- 1 ngày pull và merge develop vào nhánh của mình để update code mới nhất
- Nên sử dụng GitKraken (giao diện GUI hỗ trợ GIT)
- Các commit phải để TAG `[<Tính năng>] nội dung sơ bộ của commit`
  + ví dụ `[Init] Create folder structure, config project`

- Khi upcode lên xong muốn merge sang nhánh không phải của mình
  + Truy cập https://github.com/snowdence/hcmus-web-academy
  + Chọn `Pull Request > New Pull Request`
    + base: Chọn nhánh nhận code
    + compare: Chọn nhánh của mình chuyển code
  + Chọn Create pull request
  + Nếu cần review ở bên phải có reviewers, chọn người cần review
  + Điền comment, rồi cấn create pull request 
  
# Cài đặt code 

- Clone code
  >git clone https://github.com/snowdence/hcmus-web-academy
  
  >cd hcmus-web-academy
- Tạo nhánh phát triển từ branch develop
  >git checkout develop
  
  >git checkout -b <branch-name>

- Copy file môi trường `.envexample` thành file `.env`

- Cài đặt mã nguồn
  >npm i
- Chạy dữ liệu mẫu
  >npm run seeder

# Build template để tiện sử dụng offline (template đã mua)
  - Không để template ở thư mục mã nguồn
  - Đồ án sử dụng `demo2` của theme
  - Chỉ sử dụng để copy html, không cần copy các css assets
  - Loại bỏ những mục thừa không dùng tới trong trang mình lấy khi chuyển code sang hbs tránh mất thời gian sửa sau
  - Ưu tiên dùng template cho các phần chung (chi tiết xem trang chủ handlebar)
  
  ### Cài đặt
  - cd vào thư mục tools trong folder chứa template 
  >cd theme/html/tools/
  - Cài các gói cần thiết
  >yarn
  - Build demo2
  >gulp --demo2
  
  - Kết quả thu được code đã build ở `theme/html/demo2/dist` Mở index.html xem giao diện. 
  - Copy phần tử nào chuột phải inspect vào phần tử đó rồi chọn copy outerHtml cho chính xác
  
