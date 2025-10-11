-- Add beer_order_shipment table
-- Date: 2025-10-11

-- Create beer_order_shipment table
CREATE TABLE beer_order_shipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    shipment_date TIMESTAMP NOT NULL,
    carrier VARCHAR(255),
    tracking_number VARCHAR(255),
    beer_order_id INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Add foreign key constraint
ALTER TABLE beer_order_shipment
ADD CONSTRAINT fk_beer_order_shipment_beer_order
FOREIGN KEY (beer_order_id) REFERENCES beer_order(id);
