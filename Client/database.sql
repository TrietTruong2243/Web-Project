CREATE DATABASE "SHOPPING_WEB";
\c SHOPPING_WEB
CREATE TABLE "Customer"
(
    "CustomerID"  BIGINT PRIMARY KEY,
    "CustomerName" VARCHAR(50),
    "PhoneNumber" CHAR(10),
    "HomeAddress" VARCHAR(255),
    "Email" VARCHAR(100),
    "Password" VARCHAR(255),
    "IsGoogleAccount" BOOLEAN
);

CREATE TABLE "Admin"
( 
    "AdminID" BIGINT PRIMARY KEY,
    "AdminName" VARCHAR(100),
    "Password" VARCHAR(255),
    "Email" VARCHAR(100),
    "PhoneNumber" CHAR(10)
);
CREATE TABLE "Order"
(
    "OrderID" BIGINT PRIMARY KEY,
    "CustomerID" BIGINT,
    "Status" VARCHAR(30),
    "TotalAmount" INT,
    "OrderDate" DATE
);

CREATE TABLE "OrderProductDetail" 
(
    "OrderID" BIGINT,
    "ProductID" BIGINT,
    "Quantity" INT,
    PRIMARY KEY("OrderID","ProductID")

);

CREATE TABLE "Category"(
    "CategoryID" BIGINT PRIMARY KEY,
    "CategoryName" VARCHAR(100)
);
CREATE TABLE "Product"
(
    "ProductID" BIGINT PRIMARY KEY,
    "ProductName" VARCHAR(100),
    "Describe" VARCHAR(255),
    "Price" INT,
    "InventoryQuantity" INT,
    "CategoryID" BIGINT

);

CREATE TABLE "Image"(
    "ImageID" BIGINT PRIMARY KEY,
    "Path" VARCHAR(100),
    "ProductID" BIGINT
);
CREATE TABLE "Cart" (
    "CustomerID" BIGINT PRIMARY KEY
);

CREATE TABLE "CartItem"(
    "ProductID" BIGINT,
	"CustomerID" BIGINT,
    "Quantity" INT,
	PRIMARY KEY("ProductID","CustomerID")
    
);
-- TẠO KHÓA NGOẠI
ALTER TABLE "Order"
ADD FOREIGN KEY ("CustomerID") REFERENCES "Customer"("CustomerID");
ALTER TABLE "OrderProductDetail"
ADD FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID");
ALTER TABLE "OrderProductDetail"
ADD FOREIGN KEY ("OrderID") REFERENCES "Order"("OrderID");
ALTER TABLE "Product"
ADD FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID");
ALTER TABLE "Image"
ADD FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID");
ALTER TABLE "Cart"
ADD FOREIGN KEY ("CustomerID") REFERENCES "Customer"("CustomerID");
ALTER TABLE "CartItem"
ADD FOREIGN KEY ("CustomerID") REFERENCES "Customer"("CustomerID");
ALTER TABLE "CartItem"
ADD FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID");
