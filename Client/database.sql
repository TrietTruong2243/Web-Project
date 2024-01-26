CREATE DATABASE "SHOPPING_WEB";
\c SHOPPING_WEB
CREATE TABLE "Customer"
(
    "CustomerID"  BIGINT PRIMARY KEY,
    "Username" VARCHAR(50),
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


-- INSERT DATA

INSERT INTO public."Category"("CategoryID", "CategoryName")
	VALUES (1, 'Micellanous'),
			(2, 'Weapons');
INSERT INTO public."Customer"("CustomerID", "Username" , "CustomerName", "PhoneNumber",
 "HomeAddress", "Email", "Password", "IsGoogleAccount")
VALUES (3578081079992320, 'TestUser0427', 'Nguyen Dinh Nam Thuan'	,'1234567891',
    	'ABC',	'nthuan2609@gmail.com',	'$2b$10$tuoUaIcsB37nuYwLg4deXOHe22W2oTBF.nOlzC2WNEciKxZUydVWu',false);

INSERT INTO public."Image"("ImageID", "Path", "ProductID")
	VALUES 
        (4000000000000001,	'https://www.huntingandknives.co.uk/pub/media/catalog/product/cache/459300f1b5bd3c38ffb32210b0c2c42e/f/u/functional-medieval-sword-740.jpg',	3000000000000002),
		(4000000000000002,	'https://img.freepik.com/free-vector/vintage-dutch-bible-illustration-vector-remixed-from-artwork-by-david-s-de-vault_53876-139983.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1705968000&semt=ais',	3000000000000001),
		(4000000000000003,	'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Out_of_ink.jpg/1024px-Out_of_ink.jpg',	3000000000000003);
INSERT INTO public."Order"("OrderID", "CustomerID", "Status", "TotalAmount", "OrderDate")
	VALUES 
		(9000000000000001,	3578081079992320,	'Done',	200000,	'1999-01-08'), 
		(9000000000000002,	3578081079992320,	'Waiting',	500000,	'2023-12-29'),
		(9000000000000003,	3578081079992320,	'Done',	100000,	'2024-01-08');
INSERT INTO public."OrderProductDetail"("OrderID", "ProductID", "Quantity")
	VALUES 
		(9000000000000001,	3000000000000001,	2),
		(9000000000000001,	3000000000000003,	2),
		(9000000000000002,	3000000000000002,	1),
		(9000000000000003,	3000000000000001,   5);

INSERT INTO public."Product"(
	"ProductID", "ProductName", "Describe", "Price", "InventoryQuantity", "CategoryID")
	VALUES 
		(3000000000000001,	'Quill',	"A quill is a feather and ink. Now go buy some ink",	50000,	1000,	1),
		(3000000000000002,	'Sword',	"Made in China. Enchanted: Emotional Dmg +5",	99999,	1,	2),
		(3000000000000003,	'Book', 	"Just a normal book. You might need a quill to write on it :>",	50000,	1000,	1);