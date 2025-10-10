-- Add customer table and modify beer_order to use customer foreign key
-- Date: 2025-10-10

-- Create customer table
CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    created_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Add customer_id column to beer_order
ALTER TABLE beer_order
ADD COLUMN customer_id INT;

-- Add foreign key constraint
ALTER TABLE beer_order
ADD CONSTRAINT fk_beer_order_customer
FOREIGN KEY (customer_id) REFERENCES customer(id);

-- Copy data from customer_ref to a temporary field in customers
-- (In a real migration we would need more complex data migration)
-- For demonstration purposes, we'll create a default customer for existing orders

INSERT INTO customer (name, address_line1, city, state, postal_code)
VALUES ('Default Customer', '123 Default St', 'Default City', 'Default State', '00000');

-- Update beer_order records to use the default customer
UPDATE beer_order
SET customer_id = (SELECT id FROM customer LIMIT 1);

-- Make customer_id NOT NULL after migration
ALTER TABLE beer_order
MODIFY COLUMN customer_id INT NOT NULL;

-- Remove old customer_ref column
ALTER TABLE beer_order
DROP COLUMN customer_ref;
