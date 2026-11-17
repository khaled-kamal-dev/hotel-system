-- =====================================================================
--  Hotel Management System - MySQL Database Schema
--  Based on: ERD + Class Diagram + Use Case Diagram + Sequence Diagrams
--  Updated with:
--    1) Exact `chatbot` table as per the ERD diagram
--    2) Unified reservation status: supports both 'Checked-Out' (ERD)
--       and 'Completed' / 'COMPLETED' (Sequence Diagram 4)
--    3) Room status tracking, Room service orders, Reviews & Payments
-- =====================================================================

CREATE DATABASE IF NOT EXISTS hotel_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hotel_system;

-- Drop tables in reverse foreign key order for clean recreation if needed
DROP TABLE IF EXISTS chatbot;
DROP TABLE IF EXISTS room_status_update;
DROP TABLE IF EXISTS room_service_order;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS receptionist;
DROP TABLE IF EXISTS guest;
DROP TABLE IF EXISTS `user`;

-- =====================================================================
-- 1) user (Superclass of guest and receptionist)
-- =====================================================================
CREATE TABLE `user` (
    user_id       INT          NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT pk_user       PRIMARY KEY (user_id),
    CONSTRAINT uq_user_email UNIQUE (email)
) ENGINE = InnoDB;

-- =====================================================================
-- 2) guest (Subclass of user: user 1 --- 0..1 guest)
-- =====================================================================
CREATE TABLE guest (
    user_id INT         NOT NULL,
    phone   VARCHAR(20) NOT NULL,

    CONSTRAINT pk_guest PRIMARY KEY (user_id),
    CONSTRAINT fk_guest_user
        FOREIGN KEY (user_id) REFERENCES `user` (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- =====================================================================
-- 3) receptionist (Subclass of user: user 1 --- 0..1 receptionist)
-- =====================================================================
CREATE TABLE receptionist (
    user_id     INT         NOT NULL,
    employee_id INT         NOT NULL,
    shift       VARCHAR(20) NOT NULL,

    CONSTRAINT pk_receptionist             PRIMARY KEY (user_id),
    CONSTRAINT uq_receptionist_employee_id UNIQUE (employee_id),
    CONSTRAINT fk_receptionist_user
        FOREIGN KEY (user_id) REFERENCES `user` (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- =====================================================================
-- 4) room
-- =====================================================================
CREATE TABLE room (
    room_id         INT           NOT NULL AUTO_INCREMENT,
    room_number     VARCHAR(10)   NOT NULL,
    type            VARCHAR(30)   NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    status          VARCHAR(15)   NOT NULL DEFAULT 'Available',

    CONSTRAINT pk_room         PRIMARY KEY (room_id),
    CONSTRAINT uq_room_number  UNIQUE (room_number),
    CONSTRAINT chk_room_price  CHECK (price_per_night >= 0),
    CONSTRAINT chk_room_status CHECK (status IN ('Available', 'Occupied', 'Dirty'))
) ENGINE = InnoDB;

-- =====================================================================
-- 5) reservation
--    Guest 1 --- 0..* Reservation (makes)
--    Room 1 --- 0..* Reservation (for)
--    Receptionist 0..1 --- 0..* Reservation (handles)
--    * Unified status includes 'Checked-Out' (ERD) & 'Completed'/'COMPLETED' (Seq Diagram 4)
-- =====================================================================
CREATE TABLE reservation (
    reservation_id  INT           NOT NULL AUTO_INCREMENT,
    guest_id        INT           NOT NULL,
    room_id         INT           NOT NULL,
    receptionist_id INT           NULL,
    check_in_date   DATE          NOT NULL,
    check_out_date  DATE          NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'Pending',
    total_price     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_reservation PRIMARY KEY (reservation_id),
    CONSTRAINT uq_reservation_id_guest UNIQUE (reservation_id, guest_id),

    CONSTRAINT fk_reservation_guest
        FOREIGN KEY (guest_id) REFERENCES guest (user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reservation_room
        FOREIGN KEY (room_id) REFERENCES room (room_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reservation_receptionist
        FOREIGN KEY (receptionist_id) REFERENCES receptionist (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL,

    CONSTRAINT chk_reservation_dates  CHECK (check_out_date > check_in_date),
    CONSTRAINT chk_reservation_price  CHECK (total_price >= 0),
    CONSTRAINT chk_reservation_status
        CHECK (status IN ('Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Completed', 'COMPLETED', 'Cancelled'))
) ENGINE = InnoDB;

-- =====================================================================
-- 6) review
--    Guest 1 --- 0..* Review (writes)
--    Reservation 1 --- 0..1 Review (about)
-- =====================================================================
CREATE TABLE review (
    review_id      INT          NOT NULL AUTO_INCREMENT,
    reservation_id INT          NOT NULL,
    guest_id       INT          NOT NULL,
    rating         INT          NOT NULL,
    comment        TEXT         NULL,
    review_date    DATE         NOT NULL DEFAULT (CURRENT_DATE),

    CONSTRAINT pk_review             PRIMARY KEY (review_id),
    CONSTRAINT uq_review_reservation UNIQUE (reservation_id),

    CONSTRAINT fk_review_guest
        FOREIGN KEY (guest_id) REFERENCES guest (user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_review_reservation_guest
        FOREIGN KEY (reservation_id, guest_id) REFERENCES reservation (reservation_id, guest_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE = InnoDB;

-- =====================================================================
-- 7) payment
--    Reservation 1 --- 0..* Payment (paid by)
-- =====================================================================
CREATE TABLE payment (
    payment_id     INT           NOT NULL AUTO_INCREMENT,
    reservation_id INT           NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    method         VARCHAR(30)   NOT NULL,
    status         VARCHAR(15)   NOT NULL DEFAULT 'Pending',
    paid_at        DATETIME      NULL,
    gateway_ref    VARCHAR(60)   NULL,

    CONSTRAINT pk_payment PRIMARY KEY (payment_id),
    CONSTRAINT fk_payment_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservation (reservation_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_method CHECK (method IN ('Cash', 'Credit Card', 'Online')),
    CONSTRAINT chk_payment_status CHECK (status IN ('Pending', 'Paid', 'Failed', 'Refunded'))
) ENGINE = InnoDB;

-- =====================================================================
-- 8) room_service_order
--    Reservation 1 --- 0..* RoomServiceOrder (includes)
-- =====================================================================
CREATE TABLE room_service_order (
    order_id       INT           NOT NULL AUTO_INCREMENT,
    reservation_id INT           NOT NULL,
    items          TEXT          NOT NULL,
    total_price    DECIMAL(10,2) NOT NULL,
    status         VARCHAR(15)   NOT NULL DEFAULT 'Placed',
    ordered_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_room_service_order PRIMARY KEY (order_id),
    CONSTRAINT fk_room_service_reservation
        FOREIGN KEY (reservation_id) REFERENCES reservation (reservation_id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT chk_room_service_price  CHECK (total_price >= 0),
    CONSTRAINT chk_room_service_status CHECK (status IN ('Placed', 'Delivered', 'Cancelled'))
) ENGINE = InnoDB;

-- =====================================================================
-- 9) room_status_update
--    Receptionist 1 --- 0..* RoomStatusUpdate (performs)
--    Room         1 --- 0..* RoomStatusUpdate (logs)
-- =====================================================================
CREATE TABLE room_status_update (
    update_id       INT         NOT NULL AUTO_INCREMENT,
    receptionist_id INT         NOT NULL,
    room_id         INT         NOT NULL,
    new_status      VARCHAR(15) NOT NULL,
    updated_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_room_status_update PRIMARY KEY (update_id),
    CONSTRAINT fk_rsu_receptionist
        FOREIGN KEY (receptionist_id) REFERENCES receptionist (user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_rsu_room
        FOREIGN KEY (room_id) REFERENCES room (room_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT chk_rsu_new_status CHECK (new_status IN ('Available', 'Occupied', 'Dirty'))
) ENGINE = InnoDB;

-- =====================================================================
-- 10) chatbot (Matches the ERD exactly)
--     Guest        1    --- 0..* Chatbot (asks)
--     Receptionist 0..1 --- 0..* Chatbot (escalated to)
-- =====================================================================
CREATE TABLE chatbot (
    chat_id         INT         NOT NULL AUTO_INCREMENT,
    guest_id        INT         NOT NULL,
    receptionist_id INT         NULL,
    message         TEXT        NOT NULL,
    response        TEXT        NULL,
    escalated       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_chatbot PRIMARY KEY (chat_id),
    CONSTRAINT fk_chatbot_guest
        FOREIGN KEY (guest_id) REFERENCES guest (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_chatbot_receptionist
        FOREIGN KEY (receptionist_id) REFERENCES receptionist (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE = InnoDB;

-- =====================================================================
-- Triggers: Prevent overlapping bookings for active reservations
-- (Pending, Confirmed, Checked-In)
-- =====================================================================
DELIMITER $$

CREATE TRIGGER trg_reservation_no_overlap_insert
BEFORE INSERT ON reservation
FOR EACH ROW
BEGIN
    IF NEW.status IN ('Pending', 'Confirmed', 'Checked-In') AND EXISTS (
        SELECT 1
        FROM reservation r
        WHERE r.room_id = NEW.room_id
          AND r.status IN ('Pending', 'Confirmed', 'Checked-In')
          AND r.check_in_date < NEW.check_out_date
          AND NEW.check_in_date < r.check_out_date
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Room is already booked for those dates';
    END IF;
END$$

CREATE TRIGGER trg_reservation_no_overlap_update
BEFORE UPDATE ON reservation
FOR EACH ROW
BEGIN
    IF NEW.status IN ('Pending', 'Confirmed', 'Checked-In') AND EXISTS (
        SELECT 1
        FROM reservation r
        WHERE r.room_id = NEW.room_id
          AND r.reservation_id <> NEW.reservation_id
          AND r.status IN ('Pending', 'Confirmed', 'Checked-In')
          AND r.check_in_date < NEW.check_out_date
          AND NEW.check_in_date < r.check_out_date
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Room is already booked for those dates';
    END IF;
END$$

DELIMITER ;

-- =====================================================================
-- Views: From Use Case Diagram
-- =====================================================================

-- 1) Available rooms view (rooms available right now)
CREATE OR REPLACE VIEW v_available_rooms AS
SELECT room_id, room_number, type, price_per_night
FROM room
WHERE status = 'Available';

-- 2) Bill summary view per reservation
CREATE OR REPLACE VIEW v_reservation_bill AS
SELECT
    t.*,
    t.room_total + t.room_service_total                    AS grand_total,
    t.room_total + t.room_service_total - t.amount_paid    AS balance_due
FROM (
    SELECT
        r.reservation_id,
        u.name        AS guest_name,
        rm.room_number,
        r.check_in_date,
        r.check_out_date,
        r.status      AS reservation_status,
        r.total_price AS room_total,
        COALESCE((SELECT SUM(o.total_price)
                  FROM room_service_order o
                  WHERE o.reservation_id = r.reservation_id
                    AND o.status <> 'Cancelled'), 0)       AS room_service_total,
        COALESCE((SELECT SUM(p.amount)
                  FROM payment p
                  WHERE p.reservation_id = r.reservation_id
                    AND p.status = 'Paid'), 0)             AS amount_paid
    FROM reservation r
    JOIN `user` u  ON u.user_id = r.guest_id
    JOIN room   rm ON rm.room_id = r.room_id
) AS t;

-- =====================================================================
-- Seed Sample Data
-- Passwords:
--   Guest password:       demo123
--   Receptionist password: staff123
-- =====================================================================

INSERT INTO `user` (user_id, name, email, password_hash) VALUES
    (1, 'Omar Hassan',   'omar@example.com',        '$2b$10$rC2bQ2xQ2zD0w6F8z5gDiuW5tB5xU4F5n8o9p0q1r2s3t4u5v6w7x'),
    (2, 'Sara Ali',      'sara@example.com',        '$2b$10$rC2bQ2xQ2zD0w6F8z5gDiuW5tB5xU4F5n8o9p0q1r2s3t4u5v6w7x'),
    (3, 'Ahmed Samir',   'ahmed@hotel.com',         '$2b$10$kL8mN9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l'),
    (4, 'Mona Youssef',  'mona@example.com',        '$2b$10$rC2bQ2xQ2zD0w6F8z5gDiuW5tB5xU4F5n8o9p0q1r2s3t4u5v6w7x'),
    (5, 'Nour El-Din',   'nour@hotel.com',          '$2b$10$kL8mN9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l'),
    (6, 'Salma Mahmoud', 'salma@hotel.com',         '$2b$10$kL8mN9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l'),
    (8, 'Yasmine Tarek', 'yasmine@example.com',     '$2b$10$rC2bQ2xQ2zD0w6F8z5gDiuW5tB5xU4F5n8o9p0q1r2s3t4u5v6w7x'),
    (9, 'Tamer Hosny',   'tamer@example.com',       '$2b$10$rC2bQ2xQ2zD0w6F8z5gDiuW5tB5xU4F5n8o9p0q1r2s3t4u5v6w7x'),
    (10, 'Khaled Kamal', 'khaled.kamal@hotel.com',  '$2b$10$i2c49Y5cQe7f1K4k4a/3sux8oXvB0y3ZcNuUdfvK6dI4fUa7L7uW2');

INSERT INTO guest (user_id, phone) VALUES
    (1, '01001234567'),
    (2, '01111234567'),
    (4, '01221234567'),
    (8, '01155443322'),
    (9, '01234567890');

INSERT INTO receptionist (user_id, employee_id, shift) VALUES
    (3, 1001, 'Morning'),
    (5, 1002, 'Evening'),
    (6, 1003, 'Night'),
    (10, 1004, 'Morning');

INSERT INTO room (room_id, room_number, type, price_per_night, status) VALUES
    (1, '101', 'Single', 250.00, 'Dirty'),
    (2, '102', 'Double', 400.00, 'Available'),
    (3, '201', 'Suite',  900.00, 'Available'),
    (4, '202', 'Single', 280.00, 'Occupied'),
    (5, '301', 'Double', 450.00, 'Available'),
    (6, '302', 'Suite',  950.00, 'Available');

-- Reservations demonstrating unified Completed / Checked-Out statuses
INSERT INTO reservation (reservation_id, guest_id, room_id, receptionist_id, check_in_date, check_out_date, status, total_price) VALUES
    (1, 1, 1, 3,    '2026-10-20', '2026-10-23', 'Completed',   750.00),
    (2, 2, 2, NULL, '2026-11-15', '2026-11-17', 'Confirmed',   800.00),
    (3, 4, 4, 3,    '2026-11-09', '2026-11-12', 'Checked-In',   840.00),
    (4, 1, 3, NULL, '2026-12-01', '2026-12-03', 'Pending',    1800.00);

INSERT INTO room_service_order (order_id, reservation_id, items, total_price, status, ordered_at) VALUES
    (1, 1, 'Club Sandwich, Orange Juice', 180.00, 'Delivered', '2026-10-21 20:15:00'),
    (2, 3, 'Grill Platter, Mint Tea',     250.00, 'Delivered', '2026-11-10 13:00:00');

INSERT INTO payment (payment_id, reservation_id, amount, method, status, paid_at, gateway_ref) VALUES
    (1, 1, 930.00, 'Credit Card', 'Paid',    '2026-10-23 11:30:00', 'GW-PAY-938201'),
    (2, 2, 800.00, 'Online',      'Paid',    '2026-11-05 14:20:00', 'GW-ONLINE-77123'),
    (3, 3, 400.00, 'Credit Card', 'Paid',    '2026-11-09 15:00:00', 'GW-PAY-441029');

INSERT INTO review (review_id, reservation_id, guest_id, rating, comment, review_date) VALUES
    (1, 1, 1, 5, 'Great stay, very clean room and attentive staff.', '2026-10-23');

INSERT INTO room_status_update (update_id, receptionist_id, room_id, new_status, updated_at) VALUES
    (1, 3, 1, 'Dirty',    '2026-10-23 12:05:00'),
    (2, 3, 4, 'Occupied', '2026-11-09 15:10:00');

-- Sample records in chatbot table (as per ERD)
INSERT INTO chatbot (chat_id, guest_id, receptionist_id, message, response, escalated, created_at) VALUES
    (1, 1, NULL, 'What are your room rates and types?', 
     'We offer Single rooms (EGP 250-280/night), Double rooms (EGP 400-450/night), and Luxury Suites (EGP 900-950/night). All rooms include breakfast and high-speed Wi-Fi.', 
     0, '2026-11-10 10:00:00'),
    (2, 2, 3, 'Can I request early check-in at 10 AM?', 
     'Welcome Mrs. Sara! Your early check-in has been noted. We will prepare room 102 for your arrival.', 
     1, '2026-11-10 11:30:00');
