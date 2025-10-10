-- Create beer table
CREATE TABLE beer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    beer_name VARCHAR(255) NOT NULL,
    beer_style VARCHAR(100) NOT NULL,
    upc VARCHAR(50) NOT NULL UNIQUE,
    quantity_on_hand INT,
    price DECIMAL(19, 2)
);

-- Create beer_order table
CREATE TABLE beer_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    customer_ref VARCHAR(255),
    payment_amount DECIMAL(19, 2),
    status VARCHAR(255)
);

-- Create beer_order_line table
CREATE TABLE beer_order_line (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    order_quantity INT,
    quantity_allocated INT,
    status VARCHAR(255),
    beer_order_id INT,
    beer_id INT,
    FOREIGN KEY (beer_order_id) REFERENCES beer_order(id),
    FOREIGN KEY (beer_id) REFERENCES beer(id)
);
