-- Create base tables for the beer ordering system
-- Date: 2025-10-10

-- Beer table
CREATE TABLE beer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    beer_name VARCHAR(255),
    beer_style VARCHAR(100),
    upc VARCHAR(50) UNIQUE,
    quantity_on_hand INT,
    price DECIMAL(19, 2),
    created_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Beer order table
CREATE TABLE beer_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    customer_ref VARCHAR(255),
    payment_amount DECIMAL(19, 2),
    status VARCHAR(255),
    created_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Beer order line table (junction table)
CREATE TABLE beer_order_line (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    order_quantity INT,
    quantity_allocated INT,
    status VARCHAR(255),
    beer_order_id INT,
    beer_id INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    FOREIGN KEY (beer_order_id) REFERENCES beer_order(id),
    FOREIGN KEY (beer_id) REFERENCES beer(id)
);
